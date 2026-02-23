<template>
    <el-popover
        placement="top-start"
        :width="width"
        trigger="hover"
        :content="content"
    >
        <template #reference>
            <el-button 
                class="info-btn"
                type="info" 
                plain 
                round 
                style="margin-left: 0px; border: none; background-color: transparent;"
            ><el-icon class="info-btn"><InfoFilled /></el-icon>
            </el-button>
        </template>
    </el-popover>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch } from "vue"

const props = defineProps({content: String, width: String})

// data
const content = ref(props.content || "")
const width = ref(props.width || "")

watch(() => props.content, (newVal) => {
    content.value = newVal as string;
})
</script>

<style scoped>
.info-btn:hover {
    color: #888888;
}
</style>