import { PageData, PageMetaData } from "../types";
import utils from "./utils";
let host: string;
const IGNORE_BACKEND = true

const handshake = async (): Promise<boolean> => {
    if (IGNORE_BACKEND) return true
    const nonce = 1;
    const resp = await fetch(`${host}/handshake?nonce=${nonce}`);
    const num = await resp.json();
    return num === nonce + 1;
};

const setHost = async (url: string) => {
    host = url;
};

const getHost = async () => {
    return host;
};

const getPage = async (): Promise<string> => {
    return "ADF is super hero"
};

const getPageMetaData = async (): Promise<PageMetaData> => {
    return {
        favicon: await utils.img2DataUrl(
            "https://tailwindcss.com/favicons/favicon-32x32.png?v=3"
        ),
        title: "Fake Title".repeat(10),
        link: "123.com",
    };
};

const addPage = async (content: string, metaData: PageMetaData, isTemp: boolean): Promise<Record<string, any>> => {
    if (IGNORE_BACKEND) {
        return {
            summary: "fake summary"
        }
    }
    const resp = await fetch(`${host}/add`, {
        method: "POST",
        body: JSON.stringify({
            page: content,
            link: metaData.link,
            title: metaData.title,
            isTemp,
        }),
    });
    const data = await resp.json();
    return data;
};

// const addTempPage = async (pageData: PageData): Promise<string> => {
//     const resp = await fetch(`${host}/addTempPage`, {
//         method: "POST",
//         body: JSON.stringify(pageData),
//     });
//     const data = await resp.json();
//     return data.summary;
// };

const chat = async (msg: string, link: string): Promise<string> => {
    if (IGNORE_BACKEND) {
        return "good job"
    }
    const resp = await fetch(`${host}/chat`, {
        method: "POST",
        body: JSON.stringify({
            msg,
            link,
        }),
    });
    const data = await resp.json();
    return data.data;
};

// const chatTempPage = async (msg: string): Promise<string> => {
//     const resp = await fetch(`${host}/chatTempPage`, {
//         method: "POST",
//         body: JSON.stringify({
//             data: msg,
//         }),
//     });
//     const data = await resp.json();
//     return data.data;
// };

const log = async (msg: string) => {
    console.log("[log]: ", msg);
};

const getChatLog = async (link?: string): Promise<any[]> => {
    console.log(link)
    return [
        { msg: "msg1", is_bot: true },
        { msg: "msg2", is_bot: false },
        { msg: "msg3", is_bot: true },
        { msg: "msg4", is_bot: false },
    ]
}

const getPageList = async (): Promise<PageData[]> => {
    const rst = []
    for (let i = 0; i < 3; i++) {
        rst.push({
            link: `fakeLink${i}`.repeat(10),
            summary: "summary",
            title: `title${i}`,
            created_on: 123,
            tags: ["tag1", "tag2"],
        })
    }
    return rst
}

const delPage = async (link: string) => {
    console.log(link)
    return true
}

const setKey = async (key: string) => {
    console.log(key)
}

export default {
    handshake,
    setHost,
    getHost,
    getPage,
    getPageMetaData,
    addPage,
    chat,
    log,
    getChatLog,
    getPageList,
    delPage,
    setKey,
};
