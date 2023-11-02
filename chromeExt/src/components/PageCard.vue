<script setup lang="ts">
import { PageInfo } from "../types"
import utils from "../lib/utils";

interface Props {
    pageData: PageInfo,
    onClickDel: (link: string) => void,
    onClickChat: () => void,
}
defineProps<Props>()

</script>
<template>
    <div class="card w-full bg-white text-primary-content divBox mb-3">
        <div class="card-body p-4 break-words">
            <div class="">
                <div class="inline-block w-52 pr-2">
                    <p class="card-title block text-ellipsis overflow-hidden whitespace-nowrap">
                        {{ pageData.title || "Untitled Page" }}
                    </p>
                    <p class="text-sm text-ellipsis overflow-hidden whitespace-nowrap">{{ pageData.link }}</p>
                    <p class="text-sm">{{ utils.formatSize(pageData.size) }} • {{ utils.ts2Date(pageData.ts) }}</p>
                </div>
                <div class="inline-block w-24 align-top">
                    <div class="inline-block mr-2 tooltip" data-tip="Talk to This Page">
                        <button class="appBtn" @click="onClickChat()">
                            <img src="/comment.png" class="btnImg" />
                        </button>
                    </div>
                    <div class="inline-block tooltip" data-tip="Remove">
                        <button class="appBtn" @click="onClickDel(pageData.link)">
                            <img src="/x.png" class="btnImg" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped></style>