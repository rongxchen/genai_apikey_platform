<template>
    <div>
        <AuthBasePage :page-component="ChatViewBody" />
    </div>
</template>

<script setup lang="ts">
import AuthBasePage from './AuthBasePage.vue';
import ChatViewBody from '@/components/auth/page/ChatViewBody.vue';
</script>

<style scoped>

</style>