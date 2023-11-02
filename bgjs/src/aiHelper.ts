import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, loadQAMapReduceChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";
import { BufferMemory } from "langchain/memory";

export class Bot {
    apiKey: string;
    bot?: RetrievalQAChain;
    vectorDb?: MemoryVectorStore
    memory?: BufferMemory
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async init() {
        const vectorStore = await MemoryVectorStore.fromExistingIndex(
            new OpenAIEmbeddings({
                openAIApiKey: this.apiKey
            })
        );
        this.vectorDb = vectorStore
        const model = new OpenAI({
            openAIApiKey: this.apiKey,
        });
        // const memory = new BufferMemory();
        // this.memory = memory
        const chain = new RetrievalQAChain({
            combineDocumentsChain: loadQAMapReduceChain(model),
            retriever: vectorStore.asRetriever(),
            verbose: true,
        });
        this.bot = chain;
    }

    async addDocs(docs: Document[]) {
        await this.vectorDb?.addDocuments(docs);
    }

    addVectors(vectors: any[]) {
        if (!this.vectorDb) return
        this.vectorDb.addVectors(
            vectors.map((x) => x.embedding),
            vectors.map((x) => {
                return {
                    pageContent: x.content,
                    metadata: x.metadata,
                };
            })
        );
    }

    async query(q: string) {
        const res = await this.bot?.call({
            query: q
        });
        console.log("bot  ", this.bot)
        console.log("Q ", q)
        console.log("Res ", res)
        const msg: string = res?.text
        return msg || ""
    }

    // TODO add chat log
    // TODO import & export data
}
