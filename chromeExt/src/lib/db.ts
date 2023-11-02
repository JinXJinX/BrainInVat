const READ_WRITE_PERMISSION = "readwrite";
const indexedDB = window.indexedDB;

export class AppDB {
    db?: IDBDatabase;
    name: string;
    version: number;
    constructor(name: string, version: number) {
        this.name = name;
        this.version = version;
    }

    async init(): Promise<void> {
        return new Promise((res, reject) => {
            const dbReq = indexedDB.open(this.name, this.version);
            dbReq.onerror = (_: Event) => {
                reject();
            };
            dbReq.onupgradeneeded = (_: IDBVersionChangeEvent) => {
                const db = dbReq.result;
                this.db = db;
                this.createObjStore();
            };

            dbReq.onsuccess = (_: Event) => {
                const db = dbReq.result;
                this.db = db;
                res();
            };
        });
    }

    private async createObjStore() {
        const db = this.db;
        if (!db) return;
        if (!db.objectStoreNames.contains("chat_log")) {
            const chatLogStore = db.createObjectStore("chat_log", {
                keyPath: "ts",
                autoIncrement: true,
            });
            chatLogStore.createIndex("role", "role");
            chatLogStore.createIndex("msg", "msg");
            chatLogStore.createIndex("link_hash", "link_hash");
            // chatLogStore.createIndex("ts", "ts");
        }

        if (!db.objectStoreNames.contains("page")) {
            const chatLogStore = db.createObjectStore("page", {
                keyPath: "link_hash",
                // autoIncrement: true,
            });
            chatLogStore.createIndex("link", "link", { unique: true });
            chatLogStore.createIndex("summary", "summary");
            chatLogStore.createIndex("title", "title");
            chatLogStore.createIndex("created_on", "created_on");
        }

    }

    async addChatLog(msg: string, linkHash: string, role: number, ts: number) {
        const data = {
            link_hash: linkHash,
            msg,
            role,
            ts,
        };
        return await addRow(this.db!, "chat_log", data);
    }

    async getChatLogList(linkHash?: string): Promise<any[]> {
        let rows
        if (linkHash) {
            rows = await getRows(this.db!, "chat_log", "link_hash", linkHash);
        } else {
            rows = await getRows(this.db!, "chat_log")
        }
        return rows
    }

    async addPage(
        linkHash: string,
        link: string,
        summary: string,
        title: string,
        ts: number
    ) {
        const data = {
            link_hash: linkHash,
            link,
            summary,
            title,
            created_on: ts,
        };
        return await addRow(this.db!, "page", data);
    }

    async delPage(linkHash: string) {
        return await delRow(this.db!, "page", linkHash)
    }

    async getPageList(linkHash?: string) {
        let rows
        if (linkHash) {
            rows = await getRows(this.db!, "page", "link_hash", linkHash);
        } else {
            rows = await getRows(this.db!, "page")
        }
        return rows
    }

    addTokenLog(
        ts: number,
        type: number,
        promptTokens: number,
        completionTokens: number
    ) {
        const data = {
            ts,
            type,
            prompt_tokens: promptTokens,
            completion_tokens: completionTokens,
        };
        return addRow(this.db!, "token_log", data);
    }

    async getTokenLogList(linkHash?: string) {
        let rows
        if (linkHash) {
            rows = await getRows(this.db!, "token_log", "link_hash", linkHash);
        } else {
            rows = await getRows(this.db!, "token_log")
        }
        return rows
    }
}

const addRow = (db: IDBDatabase, name: string, row: any): Promise<any> =>
    new Promise((resolve, _) => {
        const tx = db.transaction(name, READ_WRITE_PERMISSION);
        const req = tx.objectStore(name).add(row);
        req.onsuccess = (_: Event) => {
            resolve(req.result);
        };
    });

export const getRows = (
    db: IDBDatabase,
    name: string,
    key?: string,
    value?: any
): Promise<any[]> =>
    new Promise((resolve, _) => {
        const array: any[] = [];
        const objectStore = db.transaction(name).objectStore(name);
        let req: IDBRequest;
        if (key && value) {
            req = objectStore.index(key).openCursor(value);
        } else {
            req = objectStore.openCursor();
        }
        req.onsuccess = (_: Event) => {
            const cursor = req.result;
            if (cursor) {
                array.push(cursor.value);
                cursor.continue();
            } else {
                resolve(array);
            }
        };
    });

export const getRow = (
    db: IDBDatabase,
    name: string,
    key: string,
    value: any
): Promise<any> =>
    new Promise((resolve, _) => {
        const objectStore = db.transaction(name).objectStore(name);
        const req = objectStore.index(key).get(value);
        req.onsuccess = (_: Event) => {
            resolve(req.result);
        };
    });

export const delRow = (
    db: IDBDatabase,
    name: string,
    key: string,
): Promise<any> =>
    new Promise((resolve, _) => {
        const tx = db.transaction(name, READ_WRITE_PERMISSION);
        const req = tx.objectStore(name).delete(key);
        req.onsuccess = (_: Event) => {
            resolve(req.result);
        };
    })

