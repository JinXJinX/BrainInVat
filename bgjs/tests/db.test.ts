import { expect, test } from "vitest";
import { AppDB } from "../src/db";

test("db test 1", async () => {
    const db = new AppDB("test", 1);
    await db.init();

    await db.addChatLog("1", "2", 3, 4);
    let rst = await db.getChatLogList();
    expect(rst.length).toBe(1);

    // await db.addPage("link_hash", "link", "sum", "title", 1);
    // rst = await db.getPageList();
    // expect(rst.length).toBe(1);

    // await db.addTokenLog(1, 2, 3, 4);
    // rst = await db.getTokenLogList();
    // expect(rst.length).toBe(1);
});


test("db page", async () => {
    const db = new AppDB("test", 1);
    await db.init();

    const pages: string[][] = [
        ["linkhash1", "link1", "sum1", "title1", 1],
        ["linkhash2", "link2", "sum2", "title2", 2],
    ]
    for (let i = 0; i < pages.length; i++) {
        const p = pages[i]
        await db.addPage(p[0], p[1], p[2], p[3], p[4]);
    }
    let rst = await db.getPageList();
    expect(rst.length).toBe(pages.length);

    await db.delPage(pages[0][0])
    rst = await db.getPageList();
    expect(rst.length).toBe(pages.length - 1);
    expect(rst[0].link_hash).toBe(pages[1][0])
});
