import CryptoJS from "crypto-js"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import OpenAI from 'openai';

const sanitizeUrl = (s: string): string | null => {
    let url: URL
    try {
        url = new URL(s.trim());
    } catch (error) {
        return null;
    }
    if (url.href.length > 2048 || !url.hostname) {
        return null;
    }
    if (url.pathname.length === 1) {
        url.pathname = '/';
    } else if (url.pathname.endsWith('/')) {
        url.pathname = url.pathname.slice(0, -1);
    }
    return url.href;
}

const md5 = (s: string) => {
    return CryptoJS.MD5(s).toString()
}

const currTs = () => {
    return Date.now() / 1000
}

const extractHtmlContent = (inp: string): string => {
    // const parser = new DOMParser();
    // const parsed = parser.parseFromString(inp.trim(), "text/html");
    // let content = parsed.body.textContent;
    // content = content || ""
    let content = inp
    content = content.replace(/\n+/g, '\n').replace(/\s+/g, ' ').trim();
    return content
}

const text2docs = async (inp: string, metadata?: Record<string, any>) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 20,
    });
    const docs = await splitter.createDocuments([inp]);
    if (metadata) {
        docs.forEach(doc => {
            doc.metadata = metadata
        })
    }
    return docs
}

const testOpenAIKey = async (key: string): Promise<string|null> => {
    try {
        const openai = new OpenAI({
            apiKey: key,
            dangerouslyAllowBrowser: true,
        });
        await openai.chat.completions.create({
            messages: [{ role: "user", content: "test" }],
            model: "gpt-3.5-turbo",
            max_tokens: 1,
            n: 1,
        })
        return null
        // return true, ""
    } catch (e: any) {
        return e.toString()
    }
}

export default {
    sanitizeUrl,
    md5,
    currTs,
    extractHtmlContent,
    text2docs,
    testOpenAIKey,
}