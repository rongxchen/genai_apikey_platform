<template>
    <div>
        <div class="setting-list">
            <div v-for="group of settingGroups" :key="group.header">
                <div class="setting-list-group-header grey-text">
                    {{ $t(group.header) }}
                </div>
                <div class="setting-list-group">
                    <div v-for="(item, index) of group.items" :key="item.label" class="setting-list-item">
                        <span v-if="item.type == 'redirect'" @click="item.action" class="setting-list-item-content">
                            <span>
                                {{ $t(item.label) }}
                                <InfoPopover
                                    v-if="item.meta"
                                    :content="$t(item.meta)"
                                ></InfoPopover>
                            </span>
                            <span>
                                <el-icon><ArrowRight /></el-icon>
                            </span>
                        </span>
                        <span v-else-if="item.type == 'switch'" class="setting-list-item-content">
                            <span>
                                {{ $t(item.label) }}
                                <InfoPopover
                                    v-if="item.meta"
                                    :content="$t(item.meta)"
                                ></InfoPopover>
                            </span>
                            <el-switch
                                v-model="item.switchValue"
                                inline-prompt
                                :active-action-icon="item.icons.active"
                                :inactive-action-icon="item.icons.inactive"
                                @change="item.action"
                            />
                        </span>
                        <span v-else-if="item.type == 'click'" class="setting-list-item-content">
                            <span>
                                {{ $t(item.label) }}
                                <InfoPopover
                                    v-if="item.meta"
                                    :content="$t(item.meta)"
                                ></InfoPopover>
                            </span>
                            <span v-if="item.button">
                                <el-button round plain size="small" :type="item.button.type" style="border: none;" @click="item.action">
                                    <el-icon v-if="item.button.icon">
                                        <component :is="item.button.icon"></component>
                                    </el-icon>
                                    <span>{{ $t(item.button.label) }}</span>
                                </el-button>
                            </span>
                        </span>
                        <span v-else-if="item.type == 'view'" class="setting-list-item-content">
                            <span>
                                {{ $t(item.label) }}
                                <InfoPopover
                                    v-if="item.meta"
                                    :content="$t(item.meta)"
                                ></InfoPopover>
                            </span>
                            <span>
                                <span :style="item.style">{{ item.value }}</span>
                            </span>
                        </span>
                        <span v-else-if="item.type == 'select'" class="setting-list-item-content">
                            <span>
                                {{ $t(item.label) }}
                            </span>
                            <el-select
                                :style="{ width: '80px' }"
                                v-model="item.value"
                                size="small"
                                placeholder="Select"
                                @change="item.action"
                            >
                                <el-option
                                    v-for="option in item.options"
                                    :key="option.value"
                                    :label="option.label"
                                    :value="option.value"
                                />
                            </el-select>
                        </span>
                        <el-divider v-if="index < group.items.length-1" style="margin: 0;"></el-divider>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import InfoPopover from "../InfoPopover.vue";

const props = defineProps({
    settingGroups: Array,
});

const settingGroups = ref(props.settingGroups);
</script>

<style scoped>
.settings-area {
    display: flex;
    justify-content: center;
    margin-left: 10px;
    margin-right: 10px;
}
.grey-text {
    color: grey;
}
.setting-header {
    font-size: 16px;
    font-weight: 600;
}
.setting-list-group {
    width: 100%;
    border-radius: 6px;
    margin-bottom: 20px;
    background-color: rgba(136, 136, 136, 0.1);
}
.setting-list-group-header {
    padding: 10px 5px;
    font-size: 14px;
    font-weight: 600;
}
.setting-list-item {
    height: 40px;
}
.setting-list-item-content {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
}
</style>