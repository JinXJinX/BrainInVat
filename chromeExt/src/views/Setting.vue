<script lang="ts" setup>
import { PageName } from '../types';
import PageTitle from "../components/PageTitle.vue"
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAppStore } from "../store/app";
import bgjsUtils from "../lib/bgjsUtils";
import utils from '../lib/utils';
import { notify } from "@kyvg/vue3-notification";

const router = useRouter()
const appStore = useAppStore()
const inpAPIKey = ref("")
const loading = ref(false)
const showBackBtn = computed(() => !!appStore.key)
const pageTitle = computed(() => {
    if (showBackBtn.value) return "Setting"
    return "Add an API key to start"
})

const onClickSave = async () => {
    const key = inpAPIKey.value.trim()
    if (!utils.isValidOpenAIKey(key)) return
    loading.value = true
    const rst = await bgjsUtils.setKey(key)
    if (!rst.ok) {
        notify({
            title: "Error",
            text: "Invalid API Key",
            type: "warn",
        });
    } else {
        appStore.setKey(key)
        router.replace({ name: PageName.PANEL })
    }
    loading.value = false
}

onMounted(() => {
    inpAPIKey.value = appStore.key ? "sk-**********" : ""
})
</script>
<template>
    <PageTitle :title="pageTitle" :page-name="showBackBtn ? PageName.PANEL : null" />
    <div class="relative pageBody">
        <div>
            <div class="form-control mt-2">
                <label class="label pb-1">
                    <span class="label-text font-bold">OpenAI API Key</span>
                </label>
                <input type="text" placeholder="sk-" class="input input-md input-bordered w-full border-neutral border-2"
                    @keyup.enter="onClickSave" v-model="inpAPIKey" />
                <label class="label pt-1">
                    <span class="label-text">
                        <a href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key" class="link"
                            target="_blank">
                            Where do I find my Secret API Key?
                        </a>
                    </span>
                </label>
            </div>
            <div v-if="!showBackBtn" class="px-4 mt-2">
                <img class="w-full" src="/tour.png">
            </div>
        </div>
        <button class="btn btn-block absolute bottom-0 btn-primary" @click="onClickSave"
            :disabled="!utils.isValidOpenAIKey(inpAPIKey) || loading">
            <span v-if="loading" class="loading loading-infinity loading-lg text-info"></span>
            <span v-else-if="showBackBtn">Save Change</span>
            <span v-else>Start</span>
        </button>
    </div>
</template>
