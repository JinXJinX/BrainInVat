import { PageMetaData } from "../types";

const getPageContent = async (): Promise<string> => {
    return "fake content"
    // return ""
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
