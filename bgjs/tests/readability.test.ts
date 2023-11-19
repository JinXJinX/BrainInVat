import { expect, test } from "vitest";
// import Readability from "@mozilla/readability"

const text = `
<!DOCTYPE html>
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
    </html>
`;

test("readability", async () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    // let article = new Readability.Readability(doc).parse();
    // console.log(article)

    // expect(rst.length).greaterThan(0);
    // expect(rst.startsWith("LangChain")).toBeTruthy()
});
