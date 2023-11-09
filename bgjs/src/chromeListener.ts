// import { test } from './counter.ts'
import { Assistant, getKey, saveKey } from "./asst";
import utils from "./utils";

declare let chrome: any;
let dbAsst: Assistant
let tempAsst: Assistant

const initAsst = async (key: string) => {
    dbAsst = new Assistant(true);
    await dbAsst.init(key)
    await dbAsst.initOpenAI()

    tempAsst = new Assistant(false);
    await tempAsst.init(key)
}

const reloadTempAsst = async () => {
    const key = tempAsst.key
    if (!key) return
    tempAsst = new Assistant(false);
    await tempAsst.init(key)
}

const getAsst = async (req: Record<string, any>): Promise<Assistant | null> => {
    let asst = req.temp ? tempAsst : dbAsst
    if (!asst) {
        const key = await getKey()
        if (key) {
            initAsst(key)
            asst = req.temp ? tempAsst : dbAsst
        }
    }
    return asst
}

const log = (key: string, inp: Record<string, any>, output: Record<string, any>) => {
    console.log(`[${key}]`)
    for (let key in inp) {
        console.log(`  ->${key}: ${inp[key]}`)
    }
    for (let key in output) {
        console.log(`  <-${key}: ${output[key]}`)
    }
}

const msgHelper = async (req: Record<string, any>) => {
    let resp: Record<string, any> = {
        ok: false
    };
    if (req.type === "setKey") {
        if (await utils.testOpenAIKey(req.key)) {
            await initAsst(req.key)
            await saveKey(req.key)
            resp.ok = true;
        }
    } else {
        const asst = await getAsst(req)
        if (asst) {
            switch (req.type) {
                case "chat":
                    if (asst) {
                        resp.ok = true
                        resp.msg = await asst.query(req.query)
                    } else {
                        resp.error = "asst not ready"
                    }
                    break;
                case "getChatLog":
                    const logs = await asst.getChatLog(req.link)
                    resp.ok = true
                    resp.data = logs
                    break;
                case "addChatLog":
                    await asst.addChatLog(req.log, req.link)
                    resp.ok = true
                    break;
                case "getKey":
                    const key = await getKey()
                    resp.ok = !!key
                    resp.data = key
                    break;
                case "handshake":
                    resp.ok = !!asst;
                    break;
                case "addPage":
                    if (req.temp) {
                        await reloadTempAsst()
                    }
                    const summary = await asst.addPage(req.link, req.title, req.content)
                    resp.ok = true;
                    resp.summary = summary
                    break;
                case "delPage":
                    await asst.delPage(req.link)
                    resp.ok = true;
                    break;
                case "setScope":
                    await asst.initOpenAI(req.scope)
                    resp.ok = true;
                    break;
                case "getPageList":
                    const pages = await asst.getPageList(req.link)
                    resp.ok = true
                    resp.data = pages
                    break;
                case "log":
                    console.log("[LOG] ", req)
                    resp.ok = true
                    break;
                case "info":
                    const info = await asst.info()
                    resp.ok = true
                    resp.data = info
                    break;
                default:
                    break;
            }
        } else {
            resp.error = "asst not ready"
        }
    }
    return resp
}

const msgHandler = async (
    req: Record<string, any>,
    _: any,
    sendResponse: any,
) => {
    let resp: Record<string, any> = {
        ok: false,
    }
    try {
        resp = await msgHelper(req)
    } catch (err: any) {
        resp.error = err.toString()
    }
    log(req.type, req, resp)
    sendResponse(resp);
};

const startListener = async () => {
    chrome.runtime.onMessage.addListener(
        (req: any, sender: any, sendResponse: any) => {
            msgHandler(req, sender, sendResponse);
            return true;
        }
    );
};

export { startListener };
// TODO https://vitejs.dev/guide/build.html#library-mode
