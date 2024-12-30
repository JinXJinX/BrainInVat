import { Log, DBInfo, PageInfo } from "../types"
import bgjsUtilsDev from "./bgjsUtilsDev";
import { notify } from "@kyvg/vue3-notification";

declare let chrome: any;

const helper = async (inp: Record<string, any>, silent?: boolean): Promise<Record<string, any>> => {
    const resp = await chrome.runtime.sendMessage(inp);
    if (!resp.ok && !silent) {
        const msg = resp.error || "Unknown Error"
        notify({
            title: "Error",
            text: msg,
            type: "error",
        });
        // throw new Error(msg)
        throw new Error(JSON.stringify(resp))
    }
    return resp
}

const log = async (msg: string) => {
    await helper({
        type: "log",
        data: msg,
    })
};


const setKey = async (key: string): Promise<Record<string, any>> => {
    return await helper({
        type: "setKey",
        key,
    })
};

const getKey = async (): Promise<string | null> => {
    const rst = await helper({
        type: "getKey",
    }, true)
    return rst.ok ? rst.data : null
};

const chat = async (q: string, temp?: boolean): Promise<string> => {
    const rst = await helper({
        type: "chat",
        query: q,
        temp: !!temp,
    });
    return rst.ok ? rst.msg : ""
};

const getChatLog = async (link?: string, temp?: boolean): Promise<Log[]> => {
    const rst = await helper({
        type: "getChatLog",
        link,
        temp: !!temp,
    });
    return rst.data || []
};

const addChatLog = async (log: Log, link?: string): Promise<void> => {
    await helper({
        type: "addChatLog",
        log,
        link,
    });
};

const addPage = async (link: string, title: string, content: string, temp?: boolean): Promise<string> => {
    const rst = await helper({
        type: "addPage",
        link,
        title,
        content,
        temp,
    });
    return rst.summary
}

const getPageList = async (link?: string, temp?: boolean): Promise<PageInfo[]> => {
    const rst = await helper({
        type: "getPageList",
        link,
        temp,
    });
    const pages: PageInfo[] = Object.values(rst.data)
    return pages
}

const getPage = async (link: string, temp?: boolean): Promise<PageInfo | null> => {
    const pages = await getPageList(link, temp)
    return pages.length > 0 ? pages[0] : null
}

const delPage = async (link: string) => {
    await helper({
        type: "delPage",
        link,
    });
}

const dbInfo = async (): Promise<DBInfo> => {
    const rst = await helper({
        type: "info",
    });
    return rst.data
}

const setScope = async (scope: string, temp?: boolean): Promise<boolean> => {
    const rst = await helper({
        type: "setScope",
        scope,
        temp,
    });
    return rst.ok
}

let tool = {
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
}

if (import.meta.env.DEV) {
    tool = bgjsUtilsDev
}

export default tool
