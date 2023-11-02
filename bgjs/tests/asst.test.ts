import { expect, test } from "vitest";
import { Assistant } from "../src/asst"

test("asst", async () => {
    const asst = new Assistant(true);
    let rst = await asst.getKey()
    expect(rst).toBeUndefined()
    const key = "< key >"
    await asst.init(key)
    expect(await asst.getKey()).toBe(key)

    const page = {
        link: "123",
        linkHash: "linkH",
    }
    const pageContent = "content"
    const summary = await asst.addPage(page.link, "title", pageContent)
    expect(summary.length).greaterThan(0)
    expect(asst.vectorStore?.memoryVectors.length).toBe(1)

    const p = await asst.getPageList(page.link)
    console.log("P!", p)

    const asst2 = new Assistant(true)
    await asst2.init(key)
    expect(asst2.vectorStore?.memoryVectors.length).toBe(1)
    // console.log(asst.vectorStore?.memoryVectors)

    // rst = await asst.search(pageContent)
    rst = await asst.search("xxx")
    console.log(rst)
    // expect(rst.length).toBe(1)

    // rst = await asst.search("xxx")
    // console.log("rst ", rst)
    // expect(rst.length).toBe(0)

    // rst = await asst.search(pageContent, 1, { linkHash: "123" })
    // expect(rst.length).toBe(0)

    // rst = await asst.search(pageContent, 1, { linkHash: page.linkHash })
    // expect(rst.length).toBe(1)
});


test("asst chat", async () => {
    const asst = new Assistant(true);
    const key = "< key >"
    await asst.init(key)

    const msg = await asst.query("who are you?")
    console.log(msg)
});
