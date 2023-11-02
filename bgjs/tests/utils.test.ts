import { expect, test } from "vitest";
import utils from "../src/utils";

test("utils", async () => {
    const rst = utils.md5("123")
    expect(rst.length).greaterThan(0)

    let url = "https://123.com"
    expect(utils.sanitizeUrl(url)).toBe(url + "/")
    url = "123.com"
    expect(utils.sanitizeUrl(url)).toBeNull()
});

test("utils extractHtmlContent", async () => {
    const text = `<!DOCTYPE html>
    <html>
    <head>
        <title>🦜️🔗 LangChain</title>
        <style>
        body {
            font-family: Arial, sans-serif;
        }
        h1 {
            color: darkblue;
        }
        </style>
    </head>
    <body>
        <div>
        <h1>LangChain</h1>
        <p>⚡ Building applications with LLMs through composability ⚡</p>
        </div>
        <div>
        As an open source project in a rapidly developing field, we are extremely open to contributions.
        </div>
    </body>
    </html>`;
    const rst = utils.extractHtmlContent(text)
    expect(rst.length).greaterThan(0);
    expect(rst.startsWith("LangChain")).toBeTruthy()
});
