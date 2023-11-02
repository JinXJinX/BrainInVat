<script setup lang="ts">
import { PageName } from "../types"
import { useRouter } from "vue-router"

interface Props {
    title: string,
    pageName: PageName | null,
}
const props = defineProps<Props>()

const router = useRouter()
const onClick = () => {
    if (!props.pageName) return
    router.replace({ name: props.pageName })
}
</script>
<template>
    <div class="relative h-11">
        <p class="text-center text-xl font-bold pt-2 max-w-[15rem] mx-auto overflow-hidden text-ellipsis whitespace-nowrap">
            {{ title }}</p>
        <button v-if="pageName" class="appBtn absolute left-0 top-0" @click="onClick">
            <img src="/left.png" class="btnImg" />
        </button>
    </div>
</template>
<style scoped></style>