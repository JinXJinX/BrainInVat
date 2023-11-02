import { expect, test } from "vitest";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, loadQAMapReduceChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

// https://github.com/langchain-ai/langchainjs/issues/1468#issuecomment-1666549817
test("memoryVectorStore", async () => {
    // Create a vector store from the documents.
    const vectorStore = await MemoryVectorStore.fromExistingIndex(
        new OpenAIEmbeddings()
    );
    await vectorStore.addDocuments([
        new Document({ pageContent: "foo", metadata: { source: "1" } }),
        new Document({ pageContent: "bar", metadata: { source: "2" } }),
    ]);
    const localVectorStore = JSON.stringify(vectorStore.memoryVectors);
    const filter = (doc: Document): boolean => {
        if (doc.metadata.source === "2") return true;
        return false;
    };
    let rst = await vectorStore.similaritySearch("foo", 3, filter);
    console.log("rst1 ", rst);
    // console.log("localVectorStore", localVectorStore);
    const vectors = JSON.parse(localVectorStore);
    // console.log("vectors", vectors);

    // // recover MemoryVectorStore from vectors json data
    const vectorStore2: MemoryVectorStore = new MemoryVectorStore(
        new OpenAIEmbeddings()
    );
    // for (let i = 0; i < vectors.length; i++) {
    vectorStore2.addVectors(
        vectors.map((x) => x.embedding),
        vectors.map((x) => {
            return {
                pageContent: x.content,
                metadata: x.metadata,
            };
        })
    )
    // }
    // vectors.forEach((x) =>
    //     vectorStore2.addVectors(
    //         vectors.map((x) => x.embedding),
    //         vectors.map((x) => {
    //             return {
    //                 pageContent: x.content,
    //                 metadata: x.metadata,
    //             };
    //         })
    //     )
    // );
    rst = await vectorStore2.similaritySearch("bar", 3, filter);
    console.log("rst ", rst);
});
