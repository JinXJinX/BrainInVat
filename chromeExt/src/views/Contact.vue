<script lang="ts" setup>
import { PageName } from '../types';
import PageTitle from "../components/PageTitle.vue"
import PageInfo from "../components/PageInfo.vue"
</script>
<template>
    <PageTitle title="Contact" :page-name="PageName.PANEL" />
    <PageInfo>
        Contact?
    </PageInfo>
</template>
