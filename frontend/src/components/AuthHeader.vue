<template>
    <div class="auth-header">
        <div class="title">
            GEN AI PLATFORM
            <el-select 
                class="model-select" 
                v-model="currModel" 
                @change="handleCurrModelChange"
            >
                <el-option-group
                    v-for="group in store.getters.providers"
                    :key="group.label"
                    :label="group.label"
                >
                    <el-option
                        v-for="item in group.models"
                        :key="item.model"
                        :label="item.label"
                        :value="group.name+':'+item.model"
                        :disabled="group.disabled"
                    />
                    </el-option-group>
            </el-select>
        </div>
        <div class="nav-bar">
            <!-- setting btn -->
            <el-button class="setting-btn" plain @click="openSettingModal">
                <el-icon><Setting /></el-icon>
            </el-button>
            <!-- avatar -->
            <a-popover placement="bottomRight" trigger="hover">
                <template #content>
                    <div class="avatar-popover-content">
                        <el-avatar :size="35">
                            User
                            <!-- {{ store.getters.userInfo?.username.toUpperCase().substring(0, 1) }} -->
                        </el-avatar>
                        <el-button
                            class="logout-btn"
                            @click="handleLogout"
                            type="danger"
                            plain
                            style="border: none; width: 100%;"
                            size="small"
                        >{{ $t("common.logout") }}</el-button>
                    </div>
                </template>
                <el-avatar :size="35">
                    User
                    <!-- {{ store.getters.userInfo.username.substring(0, 1).toUpperCase() }} -->
                </el-avatar>
            </a-popover>
        </div>
        <a-modal
            v-model:open="settingVisible"
            :title="$t('setting.title')"
            width="80%"
            :centered="true"
            :closable="false"
            :ok-button-props="{style: {display: 'none'}}"
            :cancel-button-props="{style: {display: 'none'}}"
        ><SettingModal />
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import store from '@/store';
import SettingModal from './auth/page/SettingModal.vue';
import router from '@/router';
import Localstorage from '@/utils/localstorage';

const settingVisible = ref(false);
const currModel = ref((store.getters.currProvider + ":" + store.getters.currModel) || "");

const openSettingModal = () => {
    settingVisible.value = true;
}
const handleCurrModelChange = (e: any) => {
    const [ provider, model ] = e.split(":");
    store.commit("setCurrModel", model);
    store.commit("setCurrProvider", provider);
    Localstorage.setItem("currModel", model, false, false);
    Localstorage.setItem("currProvider", provider, false, false);
}
const handleLogout = () => {
    store.commit("clear");
    Localstorage.removeItem("accessToken", true);
    Localstorage.removeItem("refreshToken", true);
    router.push("/");
}
</script>

<style scoped>
.auth-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
}
.nav-bar {
    justify-content: end;
}
.title {
    font-size: 20px;
    font-weight: bold;
}
.setting-btn {
    border: none;
    border-radius: 14px;
    background-color: #87878726;
    margin-right: 15px;
}
.model-select {
    width: 180px;
    margin-left: 15px;
}
.avatar-popover-content {
    width: 150px;
    display: grid;
    place-items: center;
}
.logout-btn {
    margin-top: 20px;
}
</style>