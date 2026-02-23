<template>
    <div class="side-bar">
        <div class="collapse-btn-container" v-if="isCollapsed">
            <el-tooltip :content="$t('sideBar.expandText')" :placement="tooltipPlacement">
                <div class="collapse-btn" @click="handleExpandMenu">
                    <el-icon class="collapse-btn-icon"><Expand /></el-icon>
                </div>
            </el-tooltip>
        </div>
        <div class="expand-btn-container" v-else>
            <el-tooltip :content="t('sideBar.collapseText')">
                <div class="collapse-btn" @click="handleExpandMenu">
                    <el-icon class="collapse-btn-icon"><Fold /></el-icon>
                </div>
            </el-tooltip>
        </div>
        <div v-if="!isCollapsed">
            <div class="create-chat">
                <el-button
                    class="full-width create-chat-btn"
                    @click="goDashboard"
                    type="primary"
                ><span class="create-chat-text">
                    <el-icon class="icon"><Plus /></el-icon>
                    {{ $t("sideBar.createChat") }}
                </span>
                </el-button>
            </div>
            <el-collapse class="chat-records" v-model="activeGroups">
                <div v-for="group in chatHistory.chats" :key="group.group_name">
                    <el-collapse-item :name="group.group_name" :title="group.group_name" class="chat-group" v-if="group.chats.length > 0">
                        <div 
                            @click="handleSelectChatChange(chat)" 
                            :style="handleSelectStyle(chat)" 
                            class="chat-record-item" 
                            v-for="chat of group.chats" 
                            :key="chat"
                        >
                            <span :style="buildOverflowContentStyle(1)">
                                {{ chat.title }}
                            </span>
                            <span class="chat-record-ops">
                                <a-dropdown trigger="click" placement="bottomRight">
                                    <a class="ant-dropdown-link" @click.prevent>
                                        <EllipsisOutlined />
                                    </a>
                                    <template #overlay>
                                        <a-menu>
                                            <a-menu-item>
                                                <a-popconfirm
                                                    :title="$t('common.deleteConfirm')"
                                                    :ok-text="$t('common.yes')"
                                                    :cancel-text="$t('common.no')"
                                                    placement="bottomRight"
                                                    @confirm="handleDeleteChat(chat)"
                                                ><span style="width: 250px;">{{ $t("common.delete") }}</span>
                                                </a-popconfirm>
                                            </a-menu-item>
                                            <a-menu-item>
                                                <span @click="fillRenameChatTitle(chat)">
                                                    {{ $t("sideBar.rename") }}
                                                </span>
                                            </a-menu-item>
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </span>
                        </div>
                    </el-collapse-item>
                </div>
            </el-collapse>
        </div>
        <div v-else>
            <div class="create-chat-mini" @click="goDashboard">
                <el-tooltip :content="$t('sideBar.createChat')" :placement="tooltipPlacement">
                    <el-icon class="create-chat-mini-icon">
                        <CirclePlusFilled />
                    </el-icon>
                </el-tooltip>
            </div>
        </div>
        <a-modal
            v-model:open="renameChatTitle.visible"
            :title="$t('sideBar.rename')"
            width="60%"
            :centered="true"
            :closable="true"
            :ok-button-props="{style: {display: 'none'}}"
            :cancel-button-props="{style: {display: 'none'}}"
        >
            <el-form :model="renameChatTitle" label-width="80px">
                <el-form-item label="Title">
                    <el-input v-model="renameChatTitle.title" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="renameChatTitle.visible = false">
                    {{ $t("common.cancel") }}
                </el-button>
                <el-button type="primary" @click="handleRenameChat">
                    {{ $t("common.confirm") }}
                </el-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import { EllipsisOutlined } from "@ant-design/icons-vue";
import { deleteChat, updateChatTitle } from '@/api/chat';
import { useI18n } from 'vue-i18n';
import router from '@/router';
import { useRoute } from 'vue-router';
import store from '@/store';
import { buildOverflowContentStyle } from '@/utils/style';
import Localstorage from '@/utils/localstorage';
import { ElMessage } from 'element-plus';

const route = useRoute();
const { t } = useI18n();
const emits = defineEmits(["handleExpandMenuWidth"]);

const renameChatTitle = ref({
    chatId: "",
    title: "",
    visible: false,
    loading: false,
});
const chatHistory = ref<any>({
    chats: [
        {
            group_name: t("sideBar.today"),
            chats: new Array<any>(),
        },
        {
            group_name: t("sideBar.yesterday"),
            chats: new Array<any>(),
        },
        {
            group_name: t("sideBar.previousSeven"),
            chats: new Array<any>(),
        },
        {
            group_name: t("sideBar.previousAll"),
            chats: new Array<any>(),
        },
    ],
    currChat: null,
    limit: 20,
});
const activeGroups = ref<string[]>(chatHistory.value.chats.map((group: any) => group.group_name));
const isCollapsed = ref(false);
const tooltipPlacement = ref("right");

const fillRenameChatTitle = (chat: any) => {
    renameChatTitle.value.chatId = chat.chat_id;
    renameChatTitle.value.title = chat.title;
    renameChatTitle.value.visible = true;
}
const handleRenameChat = () => {
    if (!renameChatTitle.value.title || renameChatTitle.value.title.trim() === "") {
        ElMessage.error({
            message: "Title cannot be empty"
        });
        return;
    }
    renameChatTitle.value.loading = true;
    updateChatTitle(renameChatTitle.value.chatId, renameChatTitle.value.title).then((res: any) => {
        const data = res.data;
        if (data.code === 0) {
            const index = chatHistory.value.chats.findIndex((group: any) => {
                return group.chats.findIndex((item: any) => item.chat_id === renameChatTitle.value.chatId) !== -1;
            });
            const chatIndex = chatHistory.value.chats[index].chats.findIndex((item: any) => item.chat_id === renameChatTitle.value.chatId);
            chatHistory.value.chats[index].chats[chatIndex].title = renameChatTitle.value.title;
            store.commit("updateChatTitle", {
                chatId: renameChatTitle.value.chatId,
                title: renameChatTitle.value.title,
            });
            renameChatTitle.value.chatId = "";
            renameChatTitle.value.title = "";
            renameChatTitle.value.visible = false;
        } else {
            ElMessage.error({
                message: data.message
            });
        }
        renameChatTitle.value.loading = false;
    })
}
const handleSelectStyle = (chat: any) => {
    return {
        backgroundColor: chat === chatHistory.value.currChat ? "var(--el-color-info-light-7)" : null
    };
}
const handleSelectChatChange = (chat: any) => {
    chatHistory.value.currChat = chat;
    store.commit("setCurrChat", chat);
    router.push(`/chat/${chat.chat_id}`);
}
const handleExpandMenu = () => {
    isCollapsed.value = !isCollapsed.value;
    Localstorage.setItem("isCollapsed", isCollapsed.value, true, false);
    emits("handleExpandMenuWidth");
}
const goDashboard = () => {
    router.push("/dashboard");
}
const arrangeChats = (chats: any[], clear=true) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const previousSeven = new Date(today);
    previousSeven.setDate(today.getDate() - 7);
    const todayChats = [];
    const yesterdayChats = [];
    const previousSevenChats = [];
    const previousAllChats = [];
    chats.forEach((chat) => {
        if (chat.datetime.isToday()) {
            todayChats.push(chat);
        } else if (chat.datetime.isYesterday()) {
            yesterdayChats.push(chat);
        } else if (chat.datetime.isPreviousSeven()) {
            previousSevenChats.push(chat);
        } else {
            previousAllChats.push(chat);
        }
    });
    if (clear) {
        chatHistory.value.chats.forEach((group: any) => {
            group.chats = [];
        });
    }
    chatHistory.value.chats[0].chats = chatHistory.value.chats[0].chats.concat(todayChats);
    chatHistory.value.chats[1].chats = chatHistory.value.chats[1].chats.concat(yesterdayChats);
    chatHistory.value.chats[2].chats = chatHistory.value.chats[2].chats.concat(previousSevenChats);
    chatHistory.value.chats[3].chats = chatHistory.value.chats[3].chats.concat(previousAllChats);
}
const handleDeleteChat = (chat: any) => {
    deleteChat(chat.chat_id).then((res: any) => {
        const data = res.data;
        if (data.code === 0) {
            const index = chatHistory.value.chats.findIndex((group: any) => {
                return group.chats.findIndex((item: any) => item.chat_id === chat.chat_id) !== -1;
            });
            const chatIndex = chatHistory.value.chats[index].chats.findIndex((item: any) => item.chat_id === chat.chat_id);
            chatHistory.value.chats[index].chats.splice(chatIndex, 1);
            store.commit("removeChat", chat.chat_id);
            router.push("/dashboard");
        } else {
            ElMessage.error({
                message: data.message
            });
        }
    })
}
const highlightChat = (chatId: string) => {
    chatHistory.value.chats.forEach((group: any) => {
        group.chats.forEach((chat: any) => {
            if (chat.chat_id === chatId) {
                chatHistory.value.currChat = chat;
            }
        })
    })
}

onMounted(async () => {
    const expand = Localstorage.getItem("isCollapsed", true, false);
    isCollapsed.value = expand;
    store.watch(() => store.getters.chats, (newVal: Map<string, any>) => {
        if (newVal) {
            const _chats = Array.from(newVal.values());
            _chats.sort((a, b) => {
                return b.updated_at - a.updated_at;
            });
            arrangeChats(_chats);
            const chatId = route.params.chatId as string;
            highlightChat(chatId);
        }
    }, { deep: true });
})
</script>

<style scoped>
.side-bar {
    border-right: 1px solid var(--el-color-info-light-7);
    height: 100%;
    padding-right: 10px;
}
.icon {
    margin-right: 10px;
}
.create-chat {
    display: flex;
    justify-content: start;
    margin-bottom: 30px;
}
.create-chat-btn {
    width: 150px;
    height: 45px;
    border-radius: 16px;
    font-size: 16px;
}
.create-chat-text {
    padding: 10px !important;
    display: flex;
    align-items: center;
}
.chat-record-item {
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
}
.chat-record-item:hover {
    background-color: var(--el-color-info-light-8);
}
.chat-group {
    margin-bottom: 0px;
}
.chat-group-name {
    margin-bottom: 10px;
}
.collapse-btn-container, .expand-btn-container {
    display: flex;
    margin-bottom: 10px;
}
.expand-btn-container {
    justify-content: flex-end;
}
.create-chat-mini {
    margin-top: 20px;
}
.collapse-btn, .create-chat-mini {
    width: 43px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.collapse-btn:hover, .create-chat-mini:hover {
    background-color: rgba(64, 158, 255, .1);
}
.collapse-btn-icon, .create-chat-mini-icon {
    font-size: 20px;
}
.chat-record-ops:hover {
    cursor: pointer;
}
</style>