import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { expect, test } from "vitest";

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
      <h1>🦜️🔗 LangChain</h1>
      <p>⚡ Building applications with LLMs through composability ⚡</p>
    </div>
    <div>
      As an open source project in a rapidly developing field, we are extremely open to contributions.
    </div>
  </body>
</html>`;

test("splitter", async () => {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(text, "text/html");
    console.log(parsed.body);
    const content = parsed.body.textContent;
    expect(content?.length).greaterThan(0);

    // const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    //     chunkSize: 175,
    //     chunkOverlap: 20,
    // });
    // const output = await splitter.createDocuments([text]);
});
