import OpenAI from 'openai';
import { expect, test } from "vitest";

test("openai", async () => {
    const openai = new OpenAI({
        apiKey: '< key >',
        dangerouslyAllowBrowser: true,
    });
    const rst = await openai.embeddings.create({
        input: "123",
        model: 'text-embedding-ada-002',
    })
    console.log(rst.data)
    console.log(JSON.stringify(rst.data[0].embedding).length)
    console.log(rst.usage)
});

test("openai2", async () => {
    const key = "< key >"
});