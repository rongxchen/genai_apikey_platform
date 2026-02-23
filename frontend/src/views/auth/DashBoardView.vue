<template>
    <div>
        <AuthBasePage :page-component="DashboardViewBody" />
    </div>
</template>

<script setup lang="ts">
import AuthBasePage from './AuthBasePage.vue';
import DashboardViewBody from '@/components/auth/page/DashboardViewBody.vue';
</script>

<style scoped>

</style>