import { PageMetaData } from "../types";


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

const getPageContent = async (): Promise<string> => {
    // return null
    return text
};

const getPageMetaData = async (): Promise<PageMetaData> => {
    return {
        favicon: "favicon",
        link: "link",
        title: "titletitletitle title titletitle".repeat(10),
    };
};

export default {
    getPageMetaData,
    getPageContent,
};
