import utils from "./utils"
import { Log, VectorData, PageInfo, PageInfo2 } from "./types"
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { FakeChromeStorage } from "./fakeChromeStorage";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain, loadSummarizationChain, MapReduceDocumentsChain, StuffDocumentsChain, RefineDocumentsChain } from "langchain/chains";
import { Document } from "langchain/document";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { HumanMessage, AIMessage } from "langchain/schema";
import { STUFF_PROMPT } from "./stuffPrompts"

// declare let chrome: any;

const getEmbedKey = (linkHash: string) => {
    return `embed-${linkHash}`;
};

const getChatLogKey = (linkHash: string | null) => {
    return `chatlog-${linkHash || ""}`;
};

const PAGE_INFO_KEY = "pageInfo";
const MEM_KEY = "chat_history"

let storage: any
if (import.meta.env.MODE === "test") {
    storage = new FakeChromeStorage()
} else {
    // @ts-ignore
    storage = chrome.storage
}

export const getKey = async () => {
    const data = await storage.local.get("key");
    return data ? data["key"] : null;
}

export const saveKey = async (key: string) => {
    await storage.local.set({ key });
}

// TODO record token usage
export class Assistant {
    storage: any
    key?: string
    openai?: OpenAI
    vectorStore?: MemoryVectorStore
    chain?: ConversationalRetrievalQAChain
    sumChain?: MapReduceDocumentsChain | StuffDocumentsChain | RefineDocumentsChain
    memory?: BufferMemory
    targetLinkHash: string | null = null

    constructor(useDB: boolean) {
        let storage: any
        if (import.meta.env.MODE === "test" || !useDB) {
            storage = new FakeChromeStorage()
        } else {
            // @ts-ignore
            storage = chrome.storage
        }
        this.storage = storage
    }

    async init(key: string) {
        if (this.key === key) return
        // this.storage.local.set({ key: key });
        this.key = key
        await this.initOpenAI()
    }

    // async getKey() {
    //     const data = await this.storage.local.get("key");
    //     const key = data["key"]
    //     return key;
    // }

    async info() {
        return {
            quota: this.storage.local.QUOTA_BYTES,
            size: await this.storage.local.getBytesInUse()
        }
    }

    async search(query: string, k?: number, filter?: any) {
        return await this.vectorStore?.similaritySearchWithScore(query, k, filter)
    }

    async query(question: string) {
        const rst = await this.chain?.call({
            question,
        });
        const msg: string = rst?.text
        return msg || ""
    }

    async initOpenAI(scope?: string) {
        let linkHash = scope ? utils.md5(scope) : null

        const embedding = new OpenAIEmbeddings({
            openAIApiKey: this.key,
        })
        const model = new OpenAI({
            openAIApiKey: this.key,
        });
        this.vectorStore = new MemoryVectorStore(embedding);
        let retriever = this.vectorStore.asRetriever()
        if (linkHash) {
            this.targetLinkHash = linkHash
            retriever = this.vectorStore.asRetriever({
                filter: (d: Document<Record<string, any>>) => {
                    return d.metadata.linkHash === linkHash
                }
            })
        } else {
            this.targetLinkHash = null
        }
        this.memory = await this.loadChatHistory()
        await this.loadMemoryVectorStore()
        const chain = ConversationalRetrievalQAChain.fromLLM(
            model,
            retriever,
            {
                memory: this.memory,
            }
        )
        this.chain = chain;

        this.sumChain = loadSummarizationChain(model, {
            type: "map_reduce",
            combinePrompt: STUFF_PROMPT,
        });
    }

    async getChatLogByKey(key: string) {
        let rst: Log[] = []
        const data = await this.storage.local.get(key);
        if (data && data[key]) {
            rst = data[key]
        }
        return rst
    }

    async getChatLog(link?: string): Promise<Log[]> {
        const key = getChatLogKey(link ? utils.md5(link) : null);
        return await this.getChatLogByKey(key)
    }

    async addChatLog(log: Log, link?: string) {
        const logs = await this.getChatLog(link)
        logs.push(log)
        const key = getChatLogKey(link ? utils.md5(link) : null);
        await this.storage.local.set({
            [key]: logs,
        });
    }

    async getPageList(link?: string): Promise<Record<string, PageInfo>> {
        let rst: Record<string, PageInfo2> = {}
        const data = await this.storage.local.get(PAGE_INFO_KEY);
        const pages = data[PAGE_INFO_KEY] || {}
        let selectedPages: PageInfo[] = []
        if (link) {
            const linkHash = utils.md5(link)
            const page = pages[linkHash]
            if (page) selectedPages.push(page)
        } else {
            selectedPages = Object.values(pages)
        }
        for (let i = 0; i < selectedPages.length; i++) {
            const page = selectedPages[i]
            const key = getEmbedKey(page.linkHash)
            const size = await this.storage.local.getBytesInUse(key)
            rst[page.linkHash] = {
                ...page,
                size,
            }
        }
        return rst;
    }

    async summary(docs: Document[]) {
        const res = await this.sumChain?.call({
            input_documents: docs,
        });
        return res?.text || ""
    }

    async addPage(link: string, title: string, content: string) {
        const linkHash = utils.md5(link)
        const metadata = {
            link,
            linkHash,
            title,
        }
        const docs = await utils.text2docs(content)
        const vectors = await this.content2Vectors(metadata, docs)
        if (vectors.length > 0) {
            this.addVectorData(vectors)
        }
        const summary = await this.summary(docs.slice(0, 2))
        const page = {
            link,
            linkHash,
            title,
            summary,
            ts: utils.currTs(),
        }
        const data = await this.storage.local.get(PAGE_INFO_KEY);
        const pages: Record<string, PageInfo> = data[PAGE_INFO_KEY] || {}
        pages[linkHash] = page
        await this.storage.local.set({ [PAGE_INFO_KEY]: pages })
        const key = getEmbedKey(linkHash)
        await this.storage.local.set({ [key]: vectors })
        return summary
    }

    async delPage(link: string) {
        if (!link) return
        const linkHash = utils.md5(link)
        const pages = await this.getPageList()
        delete pages[linkHash]
        await this.storage.local.set({ [PAGE_INFO_KEY]: pages })
        await this.storage.local.remove(getEmbedKey(linkHash))
        await this.storage.local.remove(getChatLogKey(linkHash))
    }

    private async text2Vector(inp: string) {
        if (!this.vectorStore) return
        const rst = this.vectorStore.embeddings.embedQuery(inp)
        return rst
    }

    private async content2Vectors(metadata: Record<string, any>, docs: Document[]): Promise<VectorData[]> {
        const vectors: VectorData[] = []
        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i]
            const nums = await this.text2Vector(doc.pageContent)
            if (nums) {
                const data: VectorData = {
                    embedding: nums as number[],
                    content: doc.pageContent,
                    metadata: metadata,
                }
                vectors.push(data)
            } else {
                // TODO raise error
            }
        }
        return vectors
    }

    private async addVectorData(vectors: VectorData[]) {
        const vs = this.vectorStore
        if (!vs) return
        vs.addVectors(
            vectors.map(d => d.embedding),
            vectors.map(d => {
                return {
                    pageContent: d.content,
                    metadata: d.metadata,
                };
            })
        )
    }

    private async loadMemoryVectorStore() {
        const vs = this.vectorStore
        if (!vs) return
        const pages = await this.getPageList()
        const pageInfoList = Object.values(pages)
        for (let i = 0; i < pageInfoList.length; i++) {
            const info = pageInfoList[i]
            const linkHash = info.linkHash
            if (!linkHash) continue
            if (this.targetLinkHash && this.targetLinkHash !== linkHash) {
                continue
            }
            const key = getEmbedKey(linkHash)
            const rst = await this.storage.local.get(key)
            if (!rst[key]) continue
            const data = rst[key] as VectorData[]
            this.addVectorData(data)
        }
    }

    private async loadChatHistory() {
        let memory = new BufferMemory({
            memoryKey: MEM_KEY,
        });
        const key = getChatLogKey(this.targetLinkHash);
        const logs = await this.getChatLogByKey(key)
        const pastMessages = logs.map(log => log.isBot ? new AIMessage(log.msg) : new HumanMessage(log.msg))
        memory = new BufferMemory({
            memoryKey: MEM_KEY,
            chatHistory: new ChatMessageHistory(pastMessages),
        })
        return memory
    }

    // TODO import & export data
}
