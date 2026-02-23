<template>
    <div>
        <el-container class="container">
            <el-header>
                <AuthHeader />
            </el-header>
            <el-divider style="margin: 0;" />
            <el-main class="main">
                <el-aside :width="leftWidth">
                    <SideBar 
                        class="side-bar" 
                        @handle-expand-menu-width="handleExpandMenuWidth"
                    />
                </el-aside>
                <el-aside :width="rightWidth">
                    <div class="chat-main">
                        <component :is="pageComponent" />
                    </div>
                </el-aside>
            </el-main>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/auth/SideBar.vue';
import { ref, defineProps, markRaw, onMounted } from 'vue';
import Localstorage from '@/utils/localstorage';
import AuthHeader from '@/components/AuthHeader.vue';
import { getChats } from '@/api/chat';
import store from '@/store';
import Datetime from '@/utils/date';

const leftWidth = ref('18%');
const rightWidth = ref('calc(99% - 18%)');

const props = defineProps({
    pageComponent: Object
});
const pageComponent = markRaw(props.pageComponent!);

const handleExpandMenuWidth = () => {
    if (leftWidth.value === "18%") {
        leftWidth.value = "70px";
        rightWidth.value = "calc(99% - 70px)";
    } else {
        leftWidth.value = "18%";
        rightWidth.value = "calc(99% - 18%)";
    }
}

onMounted(async () => {
    const isCollapsed = Localstorage.getItem("isCollapsed");
    if (isCollapsed) {
        leftWidth.value = "70px";
        rightWidth.value = "calc(99% - 70px)";
    }
    await getChats(0, 100).then((res) => {
        if (res.data.code === 0) {
            const data = res.data.data;
            data.list.forEach((chat: any) => {
                chat.chatId = chat.chat_id;
                chat.datetime = new Datetime(chat.updated_at);
                chat.messages = null;
            })
            store.commit("addChats", data.list);
        }
    });
})
</script>

<style scoped>
.container {
    height: 100vh;
}
.main {
    display: flex;
}
.chat-main {
    margin-left: 10px;
}
.side-bar {
    margin-right: 10px;
}
</style>