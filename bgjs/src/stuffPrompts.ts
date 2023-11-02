import { PromptTemplate } from "langchain/prompts";

const template = `Write a concise summary of the following content from a webpage:


"{text}"


CONCISE SUMMARY:`;

export const STUFF_PROMPT = /*#__PURE__*/ new PromptTemplate({
  template,
  inputVariables: ["text"],
});