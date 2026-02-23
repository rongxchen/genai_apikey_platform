<template>
    <div>
        <el-container class="chat-main">
            <div class="welcome-text" v-if="currChat.messages.length == 0">
                Welcome to ask anything!
            </div>
            <el-main id="messages" class="messages">
                <div class="message-box" v-for="message of currChat.messages" :key="message">
                    <MessageBox :message="message" />
                </div>
            </el-main>
            <el-footer class="chat-input">
                <el-input
                    ref="inputRef"  
                    class="search-box"
                    v-model="prompt.content"
                    type="textarea"
                    @keyup.enter="sendPrompt"
                ></el-input>
                <div class="search-icon">
                    <el-button 
                        :type="!prompt.content.trim() ? 'info' : 'primary'"
                        size="large"
                        circle 
                        @click="sendPrompt"
                        :disabled="!prompt.content.trim()" 
                    ><el-icon><Top /></el-icon>
                    </el-button>
                </div>
            </el-footer>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import StreamInstance from '@/utils/stream_request';
import { ElMessage } from 'element-plus';
import { onBeforeUnmount } from 'vue';
import { sleep } from '@/utils/sleep';
import router from '@/router';
import store from '@/store';
import MessageBox from '../MessageBox.vue';
import Datetime from '@/utils/date';

const streamInstance = new StreamInstance();

const inputRef = ref<any>(null);
const currChat = ref<any>({
    chatId: "",
    messages: new Array<any>(),
    limit: 50,
    model: "",
    provider: "",
});
const prompt = ref({
    content: "",
});
let scrollInterval: number | undefined;

const createPromptRequest = (chatId: string | null, content: string) => {
    return {
        chat_id: chatId,
        content: content,
        images: null,
        model: currChat.value.model,
        provider: currChat.value.provider,
    }
}
const createMessage = (chatId: string | null, content: string, role: string, hasThink = false) => {
    return {
        chat_id: chatId,
        message_id: "",
        content: content,
        role: role,
        model: currChat.value.model,
        created_at: 0,
        updated_at: 0,
        foldThinking: false,
        has_think: hasThink,
        think_content: "",
    }
}
function scrollDown() {
    const messages = document.getElementById("messages");
    if (messages) {
        messages.scrollTop = messages.scrollHeight;
    }
}
const updatePromptResponseContent = (msg: any) => {
    if (msg.content) {
        currChat.value.messages[currChat.value.messages.length - 1].content += msg.content;
    }
    if (msg.think_content) {
        currChat.value.messages[currChat.value.messages.length - 1].think_content += msg.think_content;
        currChat.value.messages[currChat.value.messages.length - 1].has_think = true;
        currChat.value.messages[currChat.value.messages.length - 1].foldThinking = false;
    }
}
const sendPrompt = async (e: any) => {
    if (e.shiftKey) {
        return;
    }
    prompt.value.content = prompt.value.content.trim();
    if (!prompt.value.content) {
        ElMessage.warning({
            message: "Please enter a message",
        })
        return;
    }
    if (prompt.value.content) {
        const data = createPromptRequest(null, prompt.value.content);
        currChat.value.messages.push(createMessage(
            currChat.value.chatId,
            prompt.value.content,
            "user"
        ))
        await new Promise((resolve) => {
            requestAnimationFrame(() => {
                sleep(50).then(resolve);
            })
        })
        scrollDown();
        prompt.value.content = "";
        const response = createMessage(currChat.value.chatId, "", "assistant");
        currChat.value.messages.push(response);
        const callback = async (msg: any) => {
            if (msg.status === "done") {
                router.push("/chat/" + msg.chat_id);
                currChat.value.chatId = msg.chat_id;
                currChat.value.updated_at = new Date().getTime();
                currChat.value.datetime = new Datetime(currChat.value.updated_at);
                store.commit("setCurrChat", currChat.value);
                return;
            }
            await new Promise((resolve) => {
                requestAnimationFrame(() => {
                    updatePromptResponseContent(msg);
                    sleep(50).then(resolve);
                })
            })
            scrollDown();
        }
        streamInstance.post("/api/chats/completion", data, callback);
    }
}
const clearCurrChat = () => {
    currChat.value.chatId = "";
    currChat.value.messages = new Array<any>();
    currChat.value.model = "";
    currChat.value.provider = "";
}

onMounted(() => {
    if (inputRef.value) {
        inputRef.value.focus();
    }
    if (store.getters.currChat) {
        currChat.value.model = store.getters.currModel;
        currChat.value.provider = store.getters.currProvider;
    }
})
onBeforeUnmount(() => {
    if (scrollInterval) {
        clearInterval(scrollInterval);
    }
})
</script>

<style scoped>
.chat-main {
    --search-box-height: 60px;
    padding-left: 8%;
    padding-right: 8%;
    position: relative;
    height: 80vh;;
    overflow: auto;
}
.messages {
    margin-bottom: var(--search-box-height);
}
.message-box {
    width: 100%;
}
.chat-input {
    display: flex;
    padding-left: 9%;
    padding-right: 9%;
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    height: var(--search-box-height);
    max-height: 300px;
}
.search-box {
    border: 2px solid var(--el-color-info-light-7);
    width: 100%;
    border-radius: 14px;
    align-items: center;
}
::v-deep .el-textarea__inner {
    border-radius: 12px;
    background-color: transparent;
    border: 0;
    box-shadow: 0 0 0 0px;
}
::v-deep .el-input__wrapper {
    border-radius: 12px;
    background-color: transparent;
    border: 0;
    box-shadow: 0 0 0 0px;
    padding: 10px 20px 10px 20px;
}
::v-deep .el-input-group__append {
    border-radius: 12px;
    background-color: transparent;
    border: 0;
    box-shadow: 0 0 0 0px;
}
.search-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
}
.search-icon .el-icon {
    font-size: 25px;
    color: var(--el-color-light);
}
.welcome-text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 30px;
}
</style>