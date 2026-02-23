<template>
    <div>
        <el-container class="chat-main">
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
import store from '@/store';
import { useRoute } from 'vue-router';
import { getMessages } from '@/api/message';
import Datetime from '@/utils/date';
import MessageBox from '../MessageBox.vue';
import StreamInstance from '@/utils/stream_request';
import { ElMessage } from 'element-plus';
import { getChat } from '@/api/chat';
import { onBeforeUnmount } from 'vue';
import { sleep } from '@/utils/sleep';

const route = useRoute();
const streamInstance = new StreamInstance();

const inputRef = ref<any>(null);
const currChat = ref<any>({
    chatId: "",
    messages: new Array<any>(),
    model: "",
    provider: "",
    updated_at: 0,
});
const messageLimit = 50;
const prompt = ref({
    content: "",
});
let scrollInterval: number | undefined;

const createPromptRequest = (chatId: string, content: string) => {
    return {
        chat_id: chatId,
        content: content,
        images: null,
        model: currChat.value.model,
        provider: currChat.value.provider,
    }
}
const createMessage = (chatId: string, content: string, role: string, hasThink = false) => {
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
        const data = createPromptRequest(currChat.value.chatId, prompt.value.content);
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
                store.commit("updateChatTime", currChat.value.chatId);
                return;
            }
            await new Promise((resolve) => {
                requestAnimationFrame(() => {
                    store.commit("updateChatTime", currChat.value.chatId);
                    updatePromptResponseContent(msg);
                    sleep(50).then(resolve);
                })
            })
            scrollDown();
        }
        streamInstance.post("/api/chats/completion", data, callback);
    }
}

onMounted(async () => {
    if (inputRef.value) {
        inputRef.value.focus();
    }
    if (route.params.chatId) {
        currChat.value.chatId = route.params.chatId;
        const chatInfo = await getChat(currChat.value.chatId).then((res: any) => {
            const data = res.data;
            if (data.code === 0) {
                return data.data;
            }
            return {};
        })
        currChat.value.model = chatInfo.model;
        currChat.value.provider = chatInfo.provider;
        currChat.value.updated_at = chatInfo.updated_at;
        currChat.value.datetime = new Datetime(chatInfo.updated_at);
        await getMessages(currChat.value.chatId, 0, messageLimit).then((res) => {
            const data = res.data.data;
            data.list.forEach((message: any) => {
                message.datetime = new Datetime(message.created_at);
                message.foldThinking = false;
            })
            currChat.value.messages = data.list;
            store.commit("addChats", [{
                chatId: currChat.value.chatId,
                messages: currChat.value.messages,
                provider: currChat.value.provider,
                model: currChat.value.model,
                updated_at: currChat.value.updated_at,
                datetime: currChat.value.datetime,
            }]);
        });
    }
    store.watch(() => store.state.currChat, async (newVal: any) => {
        if (newVal) {
            if (inputRef.value) {
                inputRef.value.focus();
            }
            currChat.value = newVal;
            if (store.getters.chats.has(currChat.value.chatId) && store.getters.chats.get(currChat.value.chatId).messages) {
                const chat = store.getters.chats.get(currChat.value.chatId);
                currChat.value = chat;
                sleep(100).then(() => {
                    scrollDown();
                })
                return;
            }
            await getMessages(currChat.value.chatId, 0, messageLimit).then((res) => {
                const data = res.data.data;
                data.list.forEach((message: any) => {
                    message.datetime = new Datetime(message.created_at);
                    message.foldThinking = false;
                })
                currChat.value.messages = data.list;
                store.commit("addChats", [{
                    chatId: currChat.value.chatId,
                    messages: currChat.value.messages,
                    provider: currChat.value.provider,
                    model: currChat.value.model,
                    updated_at: currChat.value.updated_at,
                    datetime: currChat.value.datetime,
                }]);
                sleep(100).then(() => {
                    scrollDown();
                })
            });
        }
    }, { deep: true });
    sleep(100).then(() => {
        scrollDown();
    })
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
    height: calc(100vh - 120px);
    overflow: auto;
    padding-bottom: 20px;
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
</style>