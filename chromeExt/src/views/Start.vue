<script lang="ts" setup>
import { PageName } from '../types';
import PageTitle from "../components/PageTitle.vue"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAppStore } from "../store/app";
import bgjsUtils from "../lib/bgjsUtils";

const router = useRouter()
const appStore = useAppStore()
const inpAPIKey = ref("")
// const inpHost = ref("")
const loading = ref(false)

const onClickSave = () => {
    const key = inpAPIKey.value
    if (!key) return
    appStore.setKey(key)
    bgjsUtils.setKey(key)
    router.replace({ name: PageName.PANEL })
}

</script>
<template>
    <PageTitle :title="'Setting'" :page-name="PageName.PANEL" />
    <div class="relative pageBody">
        <div v-if="loading" class="text-center">
            <span class="loading loading-infinity loading-lg mt-10 text-info"></span>
        </div>
        <div v-else>
            <div class="form-control mt-2">
                <label class="label pb-1">
                    <span class="label-text font-bold">OpenAI API Key</span>
                </label>
                <input type="text" placeholder="sk-" class="input input-md input-bordered w-full border-neutral border-2"
                    v-model="inpAPIKey" />
                <label class="label pt-1">
                    <span class="label-text">
                        <a href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key" class="link"
                            target="_blank">
                            Where do I find my Secret API Key?
                        </a>
                    </span>
                </label>
            </div>
        </div>
        <button v-if="!loading" class="btn btn-block absolute bottom-0 btn-primary" @click="onClickSave">
            Save Change
        </button>
    </div>
</template>
