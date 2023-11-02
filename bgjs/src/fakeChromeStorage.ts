
class FakeDB {
    data: Record<string, any>
    QUOTA_BYTES = 100
    constructor() {
        this.data = {}
    }
    async get(key: string) {
        const val = this.data[key]
        const rst: Record<string, any> = {}
        if (val) {
            rst[key] = val
        }
        return rst
    }
    async set(data: Record<string, any>) {
        console.log("set ", data)
        console.log("old data", this.data)
        this.data = {
            ...this.data,
            ...data
        }
        console.log("new data ", this.data)
    }
    async getBytesInUse(_: string) {
        return 100
    }
}

export class FakeChromeStorage {
    local: FakeDB
    sync: FakeDB
    constructor() {
        this.local = new FakeDB()
        this.sync = new FakeDB()
    }
}