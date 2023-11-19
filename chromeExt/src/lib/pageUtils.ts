import { PageMetaData } from "../types";
import pageUtilsDev from "./pageUtilsDev";
import utils from "./utils"

declare let chrome: any;

const getPageContentHelper = async (): Promise<string> => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    const rst: any[] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            // return document.body.textContent
            return document.body.outerHTML
            // return document.getElementsByTagName("html")[0].innerHTML
        },
    });
    let pData = ""
    for (let i = 0; i < rst.length; i++) {
        pData = rst[i].result;
        break;
    }
    return pData
};


const getPageContent = async (): Promise<string> => {
    let rst = ""
    try {
        rst = await getPageContentHelper()
    } catch (err: any) {

    }
    return rst
};

const getPageMetaDataHelper = async (): Promise<PageMetaData> => {
    const icon = document.querySelector("[rel=icon]");
    let faviconLink = "";
    if (icon) {
        faviconLink = (icon as HTMLLinkElement).href;
        // dataUrl = await img2DataUrl((icon as HTMLLinkElement).href);
    }
    return {
        favicon: faviconLink,
        link: window.location.href,
        title: document.title,
    };
};

const getPageMetaData = async (): Promise<PageMetaData> => {
    let pData: PageMetaData = {
        favicon: "",
        title: "",
        link: "",
    };
    // return pData

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    const rst: any[] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: getPageMetaDataHelper,
    });

    for (let i = 0; i < rst.length; i++) {
        pData = rst[i].result;
        pData.link = utils.sanitizeUrl(pData.link) || ""
        break;
    }
    return pData;
};

let tool = {
    getPageMetaData,
    getPageContent,
};

if (import.meta.env.DEV) {
    tool = pageUtilsDev
}

export default tool