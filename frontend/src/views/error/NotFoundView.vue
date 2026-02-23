<template>
    <div class="not-found-page">
        <div style="display: flex; justify-content: center; height: 100%;">
            <el-empty description="Page Not Found...">
                <el-button @click="handleBack" type="primary">Back</el-button>    
            </el-empty>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router"
import router from '@/router';

const route = useRoute()

const handleBack = () => {
    const redirect = route.query.redirect
    router.push(redirect as string)
}
</script>

<style scoped>
.not-found-page {
    height: 100vh;
}
</style>