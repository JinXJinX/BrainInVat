<script lang="ts" setup>
import { PageName } from '../types';
import PageTitle from "../components/PageTitle.vue"
import PageInfo from "../components/PageInfo.vue"
</script>
<template>
    <PageTitle title="Privacy" :page-name="PageName.PANEL" />
    <PageInfo>
        Privacy?
    </PageInfo>
</template>
