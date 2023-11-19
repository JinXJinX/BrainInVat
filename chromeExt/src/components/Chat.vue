<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue';
import { ChatLog, Log } from '../types';
// import { useRouter } from "vue-router"
import PerfectScrollbar from "perfect-scrollbar";
import { useAppStore } from '../store/app';
import bgjsUtils from '../lib/bgjsUtils';
import utils from '../lib/utils';
import pageUtils from "../lib/pageUtils"

interface Props {
  link?: string,
}
const props = defineProps<Props>()

// const router = useRouter()
const appStore = useAppStore()
const chatBoxNode = ref(null)
const loadingData = ref(false)
const loadingMsg = ref(false)
const inpMsg = ref("")
const inpBox = ref(null)
const chatLogs = ref([] as ChatLog[])
const canSendMsg = computed(() => {
  return inpMsg.value.length > 0 && !loadingMsg.value
})
const isPageBot = computed(() => appStore.isPageBot)
const isTempPageBot = computed(() => appStore.isTempPageBot)
// @ts-ignore
let ps: PerfectScrollbar
// let pageContent = null as string | null

// const onClickBack = () => {
//   // router.replace({ name: PageName.PANEL })
// }

const logMsg = async (msg: string, isBot: boolean) => {
  if (isTempPageBot.value) return
  const log: Log = {
    msg,
    isBot,
    ts: Date.now(),
  }
  await bgjsUtils.addChatLog(log, props.link)
}

const addMsg = async (msg: string, isBot: boolean, loading?: boolean, appendMode?: boolean) => {
  const log = {
    msg,
    isBot,
    loading,
  }
  if (appendMode) {
    const size = chatLogs.value.length
    chatLogs.value[size - 1] = log
  } else {
    chatLogs.value.push(log)
  }
}

const onSendMsg = async () => {
  const msg = inpMsg.value
  if (!canSendMsg.value) return
  loadingMsg.value = true
  await addMsg(msg, false)
  await logMsg(msg, false)

  inpMsg.value = ""
  await addMsg("", true, true)
  await nextTick()
  scrollToBottom()
  // if (!bot.value) (
  //   await loadPageBot()
  // )
  // const resp = await bot.value?.query(msg) || ""
  const resp = await bgjsUtils.chat(msg, isTempPageBot.value)
  await addMsg(resp, true, false, true)
  await logMsg(resp, true)

  await nextTick()
  scrollToBottom()
  loadingMsg.value = false
}

const scrollToBottom = () => {
  if (!chatBoxNode.value) return
  const node = chatBoxNode.value as HTMLElement
  node.scrollTo({
    top: node.scrollHeight,
  })
}

const loadChatLog = async () => {
  const logs = await bgjsUtils.getChatLog(props.link, isTempPageBot.value)
  chatLogs.value = []
  if (logs.length > 0) {
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i]
      await addMsg(log.msg, log.isBot)
    }
  } else {
    let msg = ""
    if (isTempPageBot.value && props.link) {
      let page = await bgjsUtils.getPage(props.link, true)
      if (page) {
        msg = page?.summary || ""
      } else {
        const content = utils.extractHtmlContent(await pageUtils.getPageContent())
        const summary = await bgjsUtils.addPage(props.link, "", content, true)
        msg = summary
        // page = await bgjsUtils.getPage(props.link, true)
      }
    } else if (isPageBot.value && props.link) {
      const data = await bgjsUtils.getPage(props.link)
      // @ts-ignore
      msg = data ? data.summary : ""
    } else {
      msg = "what's up, any question?"
    }
    await addMsg(msg, true)
    await logMsg(msg, true)
  }
  await nextTick()
  scrollToBottom()
}

onMounted(async () => {
  loadingData.value = true
  if (chatBoxNode.value) {
    ps = new PerfectScrollbar(chatBoxNode.value as HTMLElement, {
      wheelPropagation: false,
    })
  }
  if ((isTempPageBot.value || isPageBot.value) && props.link) {
    await bgjsUtils.setScope(props.link, isTempPageBot.value)
  }
  await loadChatLog()
  loadingData.value = false
  await nextTick()
  if (inpBox.value) {
    (inpBox.value as HTMLElement).focus();
  }
})
</script>

<template>
  <div class="relative">
    <div v-if="loadingData" class="text-center pt-10 h-full">
      <span class="loading loading-infinity loading-lg text-info"></span>
    </div>
    <div class="overflow-hidden relative" style="height: calc(100% - 36px);" :class="{ invisible: loadingData }"
      ref="chatBoxNode">
      <div v-for="data in chatLogs" class="py-2">
        <div class="w-12 inline-block align-top pt-1">
          <div v-if="data.isBot" class="userAvatar">
            <img v-if="isPageBot || isTempPageBot" src="/tab.png" class="w-full h-full bg-secondary" />
            <img v-else src="/logo.png" class="w-full h-full bg-primary" />
          </div>
          <div v-else class="userAvatar bg-success text-white text-md font-bold pt-1.5">YOU</div>
          <!-- <img v-else src="https://picsum.photos/id/237/200/300" class="userAvatar"> -->
        </div>
        <div
          class="inline-block px-1 overflow-hidden break-words whitespace-pre text-sm border-b-2 border-neutral min-h-[2.75rem] pl-2"
          style="width: calc(100% - 3rem);">
          <span v-if="data.loading" class="loading loading-dots loading-sm pt-1"></span>
          <p v-else class="whitespace-break-spaces">
            {{ data.msg }}
          </p>
        </div>
      </div>
      <div class="w-full h-14"></div>
    </div>
    <div v-if="!loadingData" class="absolute bottom-0 h-12 left-0 right-0 px-1">
      <div class="w-full relative">
        <input type="text"
          class="input input-bordered border-neutral border-2 input-md w-full pr-10 focus:outline-none rounded-2xl"
          v-model="inpMsg" @keydown.enter="onSendMsg" ref="inpBox" />
        <button class="absolute right-2 -translate-y-1/2 top-1/2 py-1 px-2 rounded-lg" @click="onSendMsg"
          :class="{ 'bg-primary': canSendMsg }">💬</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.userAvatar {
  @apply w-10 h-10 text-center mx-auto rounded border-neutral border-2;
}
</style>
