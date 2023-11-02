<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import bgjsUtils from '../lib/bgjsUtils';
import { PageName, PageInfo, BotType } from "../types";
import PageCard from "../components/PageCard.vue"
import PerfectScrollbar from "perfect-scrollbar";
import { notify } from "@kyvg/vue3-notification";
import PageTitle from "../components/PageTitle.vue"
import { useAppStore } from '../store/app';
import { useRouter } from 'vue-router';

const router = useRouter()
const appStore = useAppStore()
const pages = ref([] as PageInfo[])
const nodeDelPage = ref(null)
const nodeCardList = ref(null)
let modalDelPage = null as HTMLElement | null
let selectedPage = ref(null as string | null)

const delPage = (link: string) => {
    const newPages = pages.value.filter(p => p.link !== link)
    pages.value = newPages
}

const onDelPage = (link: string) => {
    selectedPage.value = link
    // @ts-ignore
    modalDelPage?.showModal()
}

const onClickTalk2Page = (link: string) => {
    appStore.setBotType(BotType.PAGE)
    appStore.selectPageLink(link)
    router.replace({ name: PageName.CHAT })
}

const onConfirmDel = async () => {
    const link = selectedPage.value
    if (!link) return
    await bgjsUtils.delPage(link)
    delPage(link)
    onCloseModalDel()
}

const onCloseModalDel = () => {
    // @ts-ignore
    modalDelPage?.close()
}

// const onClickBack = () => {
//     router.replace({ name: PageName.PANEL })
// }

onBeforeMount(async () => {
    try {
        pages.value = await bgjsUtils.getPageList()
    } catch (err) {
        notify({
            text: "Network error. Try again later",
        })
    }
})

onMounted(() => {
    // notify({
    //     title: "title",
    //     text: "Network error. Try again later",
    //     type: "error",
    //     duration: 10000,
    // })
    if (nodeDelPage.value) {
        const node = nodeDelPage.value as HTMLElement
        modalDelPage = node
    }
    if (nodeCardList.value) {
        new PerfectScrollbar(nodeCardList.value as HTMLElement, {
            suppressScrollX: true,
        })
    }
})

</script>
<template>
    <PageTitle title="Page List" :page-name="PageName.PANEL" />
    <div class="pageBody">
        <div class="h-full w-full relative overflow-hidden pt-4" ref="nodeCardList">
            <PageCard v-for="data in pages" :page-data="data" :onClickDel="onDelPage"
                :onClickChat="() => onClickTalk2Page(data.link)" class="mb-2" />
        </div>
        <dialog class="modal" ref="nodeDelPage">
            <div class="modal-box w-60">
                <h3 class="font-bold text-lg break-all">Wanna Delete "{{ selectedPage }}" from the brain?</h3>
                <p class="py-4"></p>
                <div class="">
                    <button class="btn btn-block mb-2" @click="onConfirmDel">Confirm</button>
                    <button class="btn btn-block" @click="onCloseModalDel">Cancel</button>
                </div>
            </div>
        </dialog>
    </div>
</template>
<style scoped></style>
