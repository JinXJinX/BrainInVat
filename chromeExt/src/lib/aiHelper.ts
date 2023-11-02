import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { HumanMessage, AIMessage, BaseMessage } from "langchain/schema";
import { ChatLog } from "../types"

export class Bot {
    apiKey: string;
    bot?: ConversationalRetrievalQAChain;
    vectorDb?: MemoryVectorStore
    memory?: BufferMemory
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async init(logs?: ChatLog[]) {
        const vectorStore = await MemoryVectorStore.fromExistingIndex(
            new OpenAIEmbeddings({
                openAIApiKey: this.apiKey
            })
        );
        this.vectorDb = vectorStore
        const model = new OpenAI({
            openAIApiKey: this.apiKey,
        });

        const pastMessages: BaseMessage[] = [];
        if (logs) {
            logs.forEach(log => {
                if (log.isBot) {
                    pastMessages.push(new AIMessage(log.msg))
                } else {
                    pastMessages.push(new HumanMessage(log.msg))
                }
            })
        }
        const memory = new BufferMemory({
            memoryKey: "chat_history",
            chatHistory: new ChatMessageHistory(pastMessages),
        });
        this.memory = memory
        const chain = ConversationalRetrievalQAChain.fromLLM(
            model,
            vectorStore.asRetriever(),
            { memory, }
        )
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
            question: q
        });
        const msg: string = res?.text
        return msg || ""
    }

    // TODO add chat log
    // TODO import & export data
}
