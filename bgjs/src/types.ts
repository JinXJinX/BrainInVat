
export enum ChatRole {
    HUMAN = 1,
    AI = 2,
}

export interface Log {
    msg: string,
    isBot: boolean,
    ts: number,
}

export interface VectorData {
    embedding: number[],
    content: string,
    metadata: Record<string, any>
}

export interface PageInfo {
    link: string,
    linkHash: string,
    title: string,
    summary: string,
    ts: number,
}

export interface PageInfo2 extends PageInfo {
    size: number,
}
