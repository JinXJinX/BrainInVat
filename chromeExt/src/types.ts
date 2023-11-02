
export enum PageName {
    PANEL = "panel",
    CHAT = "chat",
    SETTING = "setting",
    PAGE_LIST = "pagelist",
    FAQ = "faq",
    TOS = "tos",
    PRIVACY = "privacy",
    CONTACT = "contact",
}

export interface ChatLog {
    msg: string,
    isBot?: boolean,
    loading?: boolean,
}

export interface Log {
    msg: string,
    isBot: boolean,
    ts: number,
}

export interface PageData {
    link: string,
    summary: string,
    title: string,
    created_on: number,
    tags: string[],
}

export interface PageMetaData {
    favicon: string,
    title: string,
    link: string,
}

export enum BotType {
    PAGE = 1,
    DB = 2,
    TEMP_PAGE = 3,
}

export interface DBInfo {
    quota: number,
    size: number,
}

export interface PageInfo {
    link: string,
    linkHash: string,
    title: string,
    ts: number,
    size: number,
    summary: string,
}
