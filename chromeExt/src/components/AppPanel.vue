<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router"
import pageUtils from '../lib/pageUtils';
import { PageName, BotType, DBInfo, PageInfo } from "../types";
import { useAppStore } from "../store/app"
import bgjsUtils from "../lib/bgjsUtils";
import utils from "../lib/utils"

// defineProps<{ msg: string }>()

const router = useRouter()
const appStore = useAppStore()
const isUpdating = ref(false)
const currPageMeta = computed(() => appStore.currPageMeta)
const dbInfo = ref(null as DBInfo | null)
const pageList = ref([] as PageInfo[])
const pageInfo = ref(null as PageInfo | null)
const addBtnTooltilp = computed(() => {
  if (isUpdating.value) return "Updating..."
  if (pageInfo.value) return "Update Page"
  return "Add Page to Vet"
})
// const currPage = computed(() => appStore.currPage)
// const showFavicon = computed(() => currPageMeta.value && currPageMeta.value.favicon.length > 0)

const addPage = async (temp: boolean) => {
  const meta = currPageMeta.value
  if (!meta) return
  const content = utils.extractHtmlContent(await pageUtils.getPageContent())
  await bgjsUtils.addPage(meta.link, meta.title, content, temp)
}

const onClickAddPage = async () => {
  const pageMeta = currPageMeta.value
  if (!pageMeta || isUpdating.value) return
  isUpdating.value = true
  await addPage(false)
  await uploadDBInfo()
  isUpdating.value = false
}

const onClickSetting = () => {
  router.replace({ name: PageName.SETTING })
}

const onClickTalk2Page = async () => {
  const meta = currPageMeta.value
  if (!pageInfo.value && meta) {
    appStore.setBotType(BotType.TEMP_PAGE)
  } else {
    appStore.setBotType(BotType.PAGE)
  }
  appStore.selectPageLink(meta ? meta.link : null)
  router.replace({ name: PageName.CHAT })
}

const onClickTalk2DB = () => {
  appStore.setBotType(BotType.DB)
  appStore.selectPageLink(null)
  router.replace({ name: PageName.CHAT })
}

// @ts-ignore
const onClickPageList = () => {
  router.replace({ name: PageName.PAGE_LIST })
}

const uploadDBInfo = async () => {
  const meta = currPageMeta.value
  const pages = await bgjsUtils.getPageList()
  pageList.value = pages
  pageInfo.value = null
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    if (meta && page.link === meta.link) {
      pageInfo.value = page
      break
    }
  }
  dbInfo.value = await bgjsUtils.dbInfo()
}

onMounted(async () => {
  const meta = await pageUtils.getPageMetaData()
  const content = utils.extractHtmlContent(await pageUtils.getPageContent())
  appStore.setPageMeta(content.length > 0 ? meta : null)
  await uploadDBInfo()
})

</script>

<template>
  <div class="relative h-full">
    <div class="flex">
      <div class="w-28 h-28 divBox overflow-hidden">
        <img src="/tab.png" class="w-full h-full">
      </div>
      <div class="pl-4" style="width: calc(100% - 7rem);">
        <template v-if="currPageMeta">
          <p class="text-xl font-bold text-ellipsis line-clamp-2 text-left">
            {{ currPageMeta?.title }}
          </p>
          <p class="text-sm" v-if="pageInfo">{{ utils.ts2Date(pageInfo.ts) }}</p>
          <div class="mt-2 h-12">
            <div class="inline-block tooltip mr-4" data-tip="Talk to This Page">
              <button class="appBtn" @click="onClickTalk2Page">
                <img src="/comment.png" class="btnImg" />
              </button>
            </div>
            <div class="inline-block tooltip" :data-tip="addBtnTooltilp">
              <button class="appBtn" @click="onClickAddPage">
                <img v-if="isUpdating" src="/refresh.png" class="btnImg animate-spin" />
                <img v-else-if="pageInfo" src="/refresh.png" class="btnImg" />
                <img v-else src="/plus.png" class="btnImg" />
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="text-xl font-bold text-ellipsis line-clamp-2 text-left">
            Can't get data from this page
          </p>
        </template>
      </div>
    </div>

    <div class="w-full h-24 mt-4 divBox cursor-default">
      <div class="w-20 inline-block text-center text-6xl leading-normal align-text-bottom">🧠</div>
      <div class="w-32 inline-block text-sm align-super">
        <p class="">Num Page:</p>
        <p class="font-bold">{{ pageList.length }}</p>
        <p class="">Storage:</p>
        <p>
          <span class="font-bold">{{ utils.formatSize(dbInfo?.size || 0) }}</span>
        </p>
      </div>
      <div class="inline-block align-top pt-6" style="width: calc(100% - 13rem);">
        <div class="inline-block tooltip mr-4" data-tip="Page List">
          <button class="appBtn" @click="onClickPageList">
            <img src="/bars.png" class="btnImg" />
          </button>
        </div>
        <div class="inline-block tooltip" data-tip="Settings">
          <button class="appBtn" @click="onClickSetting">
            <img src="/cog.png" class="btnImg" />
          </button>
        </div>
      </div>
    </div>

    <div class="w-full h-12 mt-4 divBox relative cursor-pointer hover:bg-primary" @click="onClickTalk2DB">
      <p class="leading-[2.75rem] pl-2"> Ask The Brain </p>
      <div class="absolute right-0 top-0 bottom-0 w-10"><img src="/comment.png" class="btnImg mt-2.5" /></div>
    </div>
    <div class="absolute -bottom-3 left-0 right-0">
      <p class="text-center text-sm">
        <span class="mx-3 cursor-pointer" @click="() => router.replace({ name: PageName.FAQ })">FAQ</span>
        <!-- <span class="mx-3 cursor-pointer" @click="() => router.replace({ name: PageName.CONTACT })">Contact</span> -->
        <span class="mx-3 cursor-pointer" @click="() => router.replace({ name: PageName.TOS })">ToS</span>
        <!-- <span class="mx-3 cursor-pointer" @click="() => router.replace({ name: PageName.PRIVACY })">Privacy</span> -->
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btnTool {
  @apply w-full border-[3px] border-neutral rounded-md px-1 hover:bg-base-200 cursor-pointer overflow-hidden text-center;
}
</style>
