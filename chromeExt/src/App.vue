<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from "vue-router"
import { PageName } from "./types"
import bgjsUtils from './lib/bgjsUtils';
import { useAppStore } from './store/app';

const router = useRouter()
const appStore = useAppStore()
onMounted(async () => {
  const key = await bgjsUtils.getKey()
  if (!key) {
    router.replace({ name: PageName.SETTING })
    return
  }
  await appStore.setKey(key)

  // This step is required for chrome extension
  // https://stackoverflow.com/questions/44530237/use-vuerouter-and-vue-js-in-chrome-extension-issues-with-path-segments
  router.replace({ name: PageName.PANEL })
})
</script>

<template>
  <notifications classes="myNoti" position="top center" />
  <router-view />
</template>

<style scoped></style>
