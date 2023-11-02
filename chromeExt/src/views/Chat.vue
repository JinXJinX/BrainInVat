<script lang="ts" setup>
import { PageName } from '../types';
import Chat from '../components/Chat.vue'
import PageTitle from "../components/PageTitle.vue"
import { useAppStore } from '../store/app';
import { computed } from "vue"

const appStore = useAppStore()
const selectedPageLink = computed(() => appStore.selectedPageLink)
const title = computed(() => {
    if (appStore.isDBBot)
        return "Brain In Vat"
    return selectedPageLink.value || "Page"
})
</script>
<template>
    <PageTitle :title="title" :page-name="PageName.PANEL" />
    <Chat :link="selectedPageLink || undefined" class="pageBody overflow-hidden" />
</template>
