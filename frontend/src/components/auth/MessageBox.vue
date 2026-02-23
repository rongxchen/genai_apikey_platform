<template>
    <div class="user-message-box message-box" v-if="message.role === 'user'">
        <div class="message user-message">
            <span class="message-content">
                <MessageContent :content="message.content" />
            </span>
        </div>
    </div>
    <div class="assistant-message-box message-box" v-else>
        <el-avatar class="assistant-avatar" :size="35">
            {{ message.model.substring(0, 1).toUpperCase() }}
        </el-avatar>
        <div class="message assistant-message">
            <el-button v-if="message.has_think" class="fold-btn" type="" @click="message.foldThinking=!message.foldThinking">
                {{ $t("messageBox.thought") }}
                <el-icon class="fold-icon" v-if="!message.foldThinking"><ArrowUpBold /></el-icon>
                <el-icon class="fold-icon" v-else><ArrowDownBold /></el-icon>
            </el-button>
            <div class="thinking-content" v-if="message.has_think && !message.foldThinking">
                <MessageContent :content="message.think_content" />
            </div>
            <div class="message-content">
                <MessageContent :content="message.content" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps } from 'vue';
import MessageContent from './MessageContent.vue';

const props = defineProps({
    message: Object
});

const message = ref(props.message || {});

watch(() => props.message, (newVal) => {
    if (newVal) {
        message.value = newVal;
    }
}, { deep: true });
</script>

<style scoped>
.user-message-box {
    display: flex;
    justify-content: end;
}
.assistant-message-box {
    display: flex;
}
.user-message {
    /* background-color: var(--el-color-primary-light-8); */
    background-color: var(--el-color-primary);
    color: white;
    max-width: 80%;
    padding: 8px 20px;
}
.assistant-message {
    max-width: 85%;
}
.message {
    display: block;
    margin-bottom: 25px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    border-radius: 18px;
    font-family: Helvetica, Arial !important;
}
.message-content, .thinking-content {
    overflow: hidden;
    white-space: pre-wrap;
    overflow-wrap: break-word;
}
p {
    margin: 0 !important;
}
.thinking-content {
    color: #888888;
    border-left: 2px solid #88888887;
    padding-left: 10px;
    margin-bottom: 10px;
    font-size: 14px;
}
.assistant-avatar {
    margin-right: 15px;
}
.fold-btn {
    border: none;
    background-color: var(--el-color-info-light-9);
    font-size: 12px;
    margin-bottom: 5px;
    color: #888888;
}
.fold-btn:hover {
    background-color: var(--el-color-info-light-8);
    color: #888888;
}
.fold-icon {
    margin-left: 10px;
}
</style>