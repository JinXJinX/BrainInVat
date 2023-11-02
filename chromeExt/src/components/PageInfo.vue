<script setup lang="ts">
import { ref, onMounted } from "vue"
import PerfectScrollbar from "perfect-scrollbar";
const node = ref(null)
onMounted(() => {
    if (!node.value) return
    new PerfectScrollbar(node.value)
})
</script>
<template>
    <div class="pageBody break-word pt-4 overflow-hidden relative" ref="node">
        <slot></slot>
    </div>
</template>
<style scoped></style>