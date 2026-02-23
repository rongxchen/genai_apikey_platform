<template>
    <div>
        <div class="api-key-create-btn-container">
            <el-button type="primary" @click="createAPIKeyVisible=true">
                <span>
                    {{ $t('setting.apiKey.create') }}
                </span>
            </el-button>
        </div>
        <!-- api key table -->
        <el-table 
            :data="apiKeys.list" 
            stripe 
            style="width: 100%; height: 30vh;"
        >
            <el-table-column :label="$t('setting.apiKey.provider')" width="180">
                <template #default="{ row }">
                    <span>
                        <span>{{ mapProviderLabel(row.provider) }}</span>
                        <span class="default-tag" v-if="row.is_default">
                            <el-tag type="warning" size="small">default</el-tag>
                        </span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column :label="$t('setting.apiKey.key')">
                <template #default="{ row }">
                    <span v-if="row.hide">
                        {{ row.hideKey }}
                    </span>
                    <span v-else>
                        {{ row.key }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="datetime" :label="$t('setting.apiKey.createDate')" width="120">
                <template #default="{ row }">
                    <span>{{ row.datetime.getDateString() }}</span>
                </template>    
            </el-table-column>
            <el-table-column :label="$t('setting.apiKey.operation')" width="280">
                <template #default="{ row }">
                    <el-button type="info" size="small" @click="handleHideKey(row)">
                        <span v-if="row.hide">
                            {{ $t("setting.apiKey.show") }}
                        </span>
                        <span v-else>
                            {{ $t("setting.apiKey.hide") }}
                        </span>
                    </el-button>
                    <el-button type="warning" size="small" @click="handleSetDefault(row)">
                        {{ $t("setting.apiKey.setDefault") }}
                    </el-button>
                    <a-popconfirm 
                        placement="topLeft" 
                        :ok-text="$t('common.yes')" 
                        :cancel-text="$t('common.no')" 
                        @confirm="handleKeyDelete(row)"
                    >
                        <template #title>
                            <span>{{ $t('setting.apiKey.deleteConfirm') }}</span>
                        </template>
                        <el-button type="danger" size="small">
                            {{ $t('setting.apiKey.delete') }}
                        </el-button>
                    </a-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- pagination -->
        <el-pagination
            class="api-key-pagination"
            v-model:current-page="apiKeys.currPage"
            :background="true"
            layout="total, prev, pager, next, jumper"
            size="small"
            :total="apiKeys.total"
            @current-change="handleCurrentChange"
        />
        <!-- create api key modal -->
        <a-modal
            v-model:open="createAPIKeyVisible"
            :title="$t('setting.apiKey.create')"
            width="50%"
            :centered="true"
            :closable="false"
            :ok-button-props="{style: {display: 'none'}}"
            :cancel-button-props="{style: {display: 'none'}}"
        >
            <el-form label-position="top">
                <el-form-item :label="$t('setting.apiKey.provider')">
                    <el-select v-model="createAPIKeyForm.provider" :placeholder="$t('setting.apiKey.providerPlaceholder')">
                        <el-option
                            v-for="provider in apiKeys.providers"
                            :key="provider.name"
                            :label="provider.label"
                            :value="provider.name"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('setting.apiKey.key')">
                    <el-input 
                        v-model="createAPIKeyForm.key" 
                        :placeholder="$t('setting.apiKey.keyPlaceholder')" 
                        type="password"
                        show-password
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="" @click="createAPIKeyVisible=false">
                        {{ $t('common.cancel') }}
                    </el-button>
                    <el-button type="primary" @click="handleCreateAPIKey">
                        {{ $t('common.confirm') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { 
    getAPIKeyList,
    createAPIKey, 
    deleteAPIKey,
    setDefaultAPIKey,
    getAPIKeyProviderList,
} from "@/api/api_key";
import { ref, onMounted } from "vue";
import Datetime from "@/utils/date";
import { ElMessage } from "element-plus";
import store from "@/store";

const apiKeys = ref({
    list: [],
    currPage: 1,
    limit: 20,
    total: 0,
    providers: [],
});
const createAPIKeyVisible = ref(false);
const createAPIKeyForm = ref({
    provider: "",
    key: "",
});

const mapProviderLabel = (provider: string) => {
    const providers = apiKeys.value.providers;
    for (let i = 0; i < providers.length; i++) {
        if (providers[i].name === provider) {
            return providers[i].label;
        }
    }
    return provider;
}
const handleCreateAPIKey = () => {
    createAPIKeyForm.value.provider = createAPIKeyForm.value.provider.trim();
    createAPIKeyForm.value.key = createAPIKeyForm.value.key.trim();
    if (createAPIKeyForm.value.provider === "" || createAPIKeyForm.value.key === "") {
        ElMessage.warning({
            message: "Please check your input",
        })
        return;
    }
    createAPIKey({
        provider: createAPIKeyForm.value.provider,
        key: createAPIKeyForm.value.key,
    }).then((res: any) => {
        const data = res.data;
        if (data.code === 0) {
            ElMessage.success({
                message: data.message
            })
            handleGetAPIKeyList(true, 0);
            getAPIKeyProviderList().then((res: any) => {
                if (res.data.code === 0) {
                    store.commit("setProviders", res.data.data);
                }
            });
            createAPIKeyForm.value.provider = "";
            createAPIKeyForm.value.key = "";
            createAPIKeyVisible.value = false;
        } else {
            ElMessage.error({
                message: data.message
            })
        }
    });
}
const handleSetDefault = (apiKey: any) => {
    setDefaultAPIKey(apiKey.provider, apiKey.api_key_id).then((res: any) => {
        const data = res.data;
        if (data.code === 0) {
            ElMessage.success({
                message: data.message
            })
            handleGetAPIKeyList(true, 0);
        } else {
            ElMessage.error({
                message: data.message
            })
        }
    })
}
const handleHideKey = (apiKey: any) => {
    apiKey.hide = !apiKey.hide;
}
const hideKey = (apiKey: any) => {
    const key = apiKey.key;
    return key.substring(0, 8) + '******' + key.substring(key.length-8, key.length);
}
const handleGetAPIKeyList = (clear = false, skip = -1) => {
    if (clear) {
        apiKeys.value.list = [];
    }
    getAPIKeyList(skip >= 0 ? skip : apiKeys.value.list.length, apiKeys.value.limit).then((res: any) => {
        const data = res.data.data;
        data.list.forEach((apiKey: any) => {
            apiKey.datetime = new Datetime(apiKey.created_at);
            apiKey.hideKey = hideKey(apiKey);
            apiKey.hide = true;
        })
        apiKeys.value.list = apiKeys.value.list.concat(data.list); 
        apiKeys.value.total = data.total;
    });
}
const handleCurrentChange = (val: number) => {
    handleGetAPIKeyList(true, (val - 1) * apiKeys.value.limit);
}
const handleKeyDelete = (apiKey: any) => {
    deleteAPIKey(apiKey.api_key_id).then((res: any) => {
        const data = res.data;
        if (data.code === 0) {
            ElMessage.success({
                message: data.message
            })
            handleGetAPIKeyList(true, 0);
            getAPIKeyProviderList().then((res: any) => {
                if (res.data.code === 0) {
                    store.commit("setProviders", res.data.data);
                }
            });
        } else {
            ElMessage.error({
                message: data.message
            })
        }
    })
}

onMounted(() => {
    handleGetAPIKeyList(true, 0);
    apiKeys.value.providers = store.getters.providers;
})
</script>

<style scoped>
.api-key-pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.api-key-create-btn-container {
    margin-bottom: 20px;
    display: flex;
    justify-content: end;
}
.default-tag {
    margin-left: 10px;
}
</style>