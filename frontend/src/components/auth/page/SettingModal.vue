<template>
    <div class="setting-modal-content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('setting.general.title')" name="general">
                <SettingList :setting-groups="settings.general" />
            </el-tab-pane>
            <el-tab-pane :label="$t('setting.apiKey.title')" name="apiKey">
                <APIKeyList />
            </el-tab-pane>
            <el-tab-pane :label="$t('setting.personal.title')" name="personal">
                <div>

                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { TabsPaneContext } from "element-plus";
import { ref, markRaw } from "vue";
import SettingList from "../SettingList.vue";
import { useDark, useToggle } from '@vueuse/core';
import Localstorage from "@/utils/localstorage"
import { useI18n } from 'vue-i18n';
import store from "@/store";
import { Sunny, Moon } from '@element-plus/icons-vue';
import APIKeyList from "../APIKeyList.vue";

const { locale } = useI18n();

const themeIcons = {
    moonIcon: markRaw(Moon),
    sunIcon: markRaw(Sunny),
}
const isDark = ref(useDark())
const lang = ref(store.getters.lang);
const settings = ref({
    general: [
        {
            header: "setting.general.device",
            items: [
                {
                    label: "setting.general.darkMode",
                    type: "switch",
                    switchValue: isDark,
                    icons: {
                        active: themeIcons.moonIcon, 
                        inactive: themeIcons.sunIcon
                    },
                    action: () => {
                        useToggle(isDark)
                        store.commit("changeTheme")
                    },
                },
                {
                    label: "setting.general.changeLang",
                    type: "select",
                    value: lang,
                    options: [
                        { label: "English", value: "en" },
                        { label: "中文", value: "zh" },
                    ],
                    action: (val: any) => {
                        locale.value = val;
                        Localstorage.setLang(val);
                        store.commit("setLang", val);
                    },
                },
            ]
        }
    ]
});
const activeName = ref("general");

const handleClick = (tab: TabsPaneContext, event: Event) => {
    return;
}
</script>

<style scoped>
.setting-modal-content {
    height: 60vh;
}
</style>