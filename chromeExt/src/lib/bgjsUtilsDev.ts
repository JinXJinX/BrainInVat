import { Log, DBInfo, PageInfo } from "../types"
import utils from "./utils";

const db: Record<string, any> = {}
const log = async (msg: string): Promise<void> => {
    console.log(`[LOG] ${msg}`)

};


const setKey = async (key: string): Promise<Record<string, any>> => {
    db[key] = key
    await utils.sleep(2000)
    return { ok: true }
};

const getKey = async (): Promise<string | null> => {
    return db.key || null
};

const chat = async (q: string, temp?: boolean): Promise<string> => {
    console.log(q, temp)
    return "fake reply"
};

const getChatLog = async (link?: string, temp?: boolean): Promise<Log[]> => {
    console.log(link, temp)
    const rst: Log[] = [
        {
            msg: "fake reply1",
            isBot: true,
            ts: Date.now(),
        },
        {
            msg: "fake msg".repeat(10),
            isBot: false,
            ts: Date.now(),
        },
    ]
    return rst
};

const addChatLog = async (log: Log, link?: string): Promise<void> => {
    console.log(log, link)
    return
};

const addPage = async (link: string, title: string, content: string, temp?: boolean): Promise<string> => {
    console.log(link, title, content, temp)
    await utils.sleep(3000)
    return "summary"
}

const pages: PageInfo[] = [
    {
        link: "https://www.google.com",
        linkHash: "fakehash",
        title: "fake title",
        summary: "sum",
        ts: Date.now() / 1000,
        size: 100,
    },
    {
        link: "https://www.youtube.com",
        linkHash: "fakehash",
        title: "fake title 123123123213",
        summary: "sum",
        ts: Date.now() / 1000,
        size: 100123123,
    },
    {
        link: "https://www.youtube.com",
        linkHash: "fakehash",
        title: "fake title 123123123213",
        summary: "sum",
        ts: Date.now() / 1000,
        size: 100123123,
    },
    {
        link: "https://www.youtube.com",
        linkHash: "fakehash",
        title: "fake title 123123123213",
        summary: "sum",
        ts: Date.now() / 1000,
        size: 100123123,
    },
    {
        link: "https://www.youtube.com",
        linkHash: "fakehash",
        title: "fake title 123123123213",
        summary: "sum",
        ts: Date.now() / 1000,
        size: 100123123,
    },
]
const getPageList = async (_?: string): Promise<PageInfo[]> => {
    return pages
}

const getPage = async (_: string): Promise<PageInfo | null> => {
    return pages[0]
}

const dbInfo = async (): Promise<DBInfo> => {
    return {
        quota: 1000,
        size: 200,
    }
}

const setScope = async (scope: string, temp?: boolean): Promise<boolean> => {
    console.log('scope ', scope, temp)
    return true
}

const delPage = async (link: string) => {
    console.log("del page", link)
}

export default {
    log,
    setKey,
    getKey,
    getChatLog,
    addChatLog,
    chat,
    addPage,
    getPageList,
    getPage,
    dbInfo,
    setScope,
    delPage,
};
