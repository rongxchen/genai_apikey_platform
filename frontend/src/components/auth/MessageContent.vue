<template>
    <div class="message-content">
        <span v-for="part of prettifiedParts" :key="part">
            <span v-if="part.type === 'html'">
                <span v-html="part.content"></span>
            </span>
            <span class="text" v-else-if="part.type === 'text'">
                <component :style="part.effect ? part.effect : {}" :is="part.tag">{{ part.content }}</component>
            </span>
            <div class="code-container" v-else-if="part.type === 'code'">
                <div class="code-space">
                    <div class="code-lang">
                        <span>{{ part.lang }}</span>
                        <span>
                            <span 
                                class="copy-icon"
                                @click="handleCopy(part.content)"
                            ><el-icon><CopyDocument /></el-icon>
                            </span>
                        </span>
                    </div>
                    <VueCodeHighlighter 
                        :code="part.content" 
                        :lang="part.lang" 
                        :title="part.lang" 
                    />
                </div>
            </div>
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';
import { copyText } from "@/utils/copy";
import { ElMessage } from 'element-plus';
import { parseMarkdown } from '@/utils/markdown';

const props = defineProps({
    content: String,
});
const content = ref(props.content || "");
const prettifiedParts = ref(parseMarkdown(content.value));

const handleCopy = (content: string) => {
    copyText(content);
    ElMessage.success({
        message: "Code copied to clipboard",
    })
}

watch(() => props.content, (newVal) => {
    if (newVal) {
        content.value = newVal;
        prettifiedParts.value = parseMarkdown(content.value);
    }
}, { immediate: true });
</script>

<style scoped>
.code-container {
    margin: 5px 0 5px 0 !important;
}
.code-space {
    border-radius: 14px;
    background-color: #334155;
    color: var(--el-color-white);
}
.code-lang {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* top right bottom left */
    padding: 5px 15px 5px 15px;
    font-size: 13px;
}
.copy-icon {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.copy-icon:hover {
    cursor: pointer;
}
</style>