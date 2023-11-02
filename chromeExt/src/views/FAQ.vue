<script lang="ts" setup>
import { PageName } from '../types';
import PageTitle from "../components/PageTitle.vue"
import PageInfo from "../components/PageInfo.vue"
const qaList = [
    {
        "q": "What is 'Brain in Vat'?",
        "a": "\"Brain in Vat\" is a Chrome extension designed to help users read and understand web pages faster. By interacting with an AI system, users can gain insights and information about the content of any webpage."
    },

    {
        "q": "How do I use the extension?",
        "a": "Simply click on the \"Brain in Vat\" icon on your Chrome toolbar to activate the AI. You can then engage with the AI using voice commands or by typing in your queries."
    },

    {
        "q": "Is my data safe?",
        "a": "Yes. The extension stores data locally in your browser using `chrome.storage`, ensuring that no personal data is shared with third parties. However, some non-personalized data is sent to OpenAI for processing and generating insights."
    },

    {
        "q": "How do I delete my data?",
        "a": "Users have the right to delete their locally stored data at any time. You can do this through the Extension's Page List."
    },

    {
        "q": "Is \"Brain in Vat\" free?",
        "a": "Yes, \"Brain in Vat\" is an open-source tool and is free to use."
    },

    {
        "q": "Do I need an internet connection to use the extension?",
        "a": "While many functionalities of the extension can work offline, certain features, especially those that interact with OpenAI, require an active internet connection."
    },

    {
        "q": "Can children use \"Brain in Vat\"?",
        "a": "The extension is not designed for or directed to children under the age of 16. We recommend that guardians supervise young users when they interact with online tools."
    },

    {
        "q": "How can I contribute to the project?",
        "a": "Since \"Brain in Vat\" is open-source, we welcome contributions from the community. You can find our repository, where you can suggest features, report bugs, or even contribute to the codebase."
    },

    {
        "q": "I found a bug or have a suggestion. How can I report it?",
        "a": "We appreciate feedback from our users. If you encounter any issues or have suggestions for improvements, please reach out to us [via our contact form / email / GitHub repository]."
    },

    {
        "q": "How often is the extension updated?",
        "a": "The extension receives periodic updates to improve its functionality, address bugs, and incorporate user feedback. We recommend always using the latest version for the best experience."
    }
]

</script>
<template>
    <PageTitle title="FAQ" :page-name="PageName.PANEL" />
    <PageInfo>
        <div v-for="(data, idx) in qaList" class="mb-4">
            <p class="font-bold">{{ idx + 1 }}. {{ data.q }} </p>
            <p> {{ data.a }} </p>
        </div>
    </PageInfo>
</template>
