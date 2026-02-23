<template>
    <div>
        <div class="reg-form-container flex-center align-center">
            <div class="reg-form">
                <el-form
                    :model="regForm"
                >
                    <el-form-item>
                        <el-input
                            v-model="regForm.email"
                            :placeholder="$t('reg.emailPlaceholder')"
                            prefix-icon="Message"
                        ></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-input
                            v-model="regForm.username"
                            :placeholder="$t('reg.usernamePlaceholder')"
                            prefix-icon="User"
                        ></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-input
                            v-model="regForm.password"
                            :placeholder="$t('reg.passwordPlaceholder')"
                            type="password"
                            show-password
                            prefix-icon="Lock"
                        ></el-input>
                    </el-form-item>

                    <el-form-item>
                        <div style="width: 100%;">
                            <a-spin :spinning="regLoading">
                                <el-button
                                    class="reg-btn"
                                    type="primary"
                                    @click="handleRegister"
                                >{{ $t("reg.regBtn") }}</el-button>
                            </a-spin>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <div class="login-text">
                            {{ $t("reg.loginText") }}
                            <el-button
                                class="login-btn"
                                link
                                @click="$router.push('/login')"
                            >{{ $t("reg.loginBtn") }}</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { register } from "@/api/user";
import { ElMessage } from "element-plus";
import router from "@/router";

const regForm = ref({
    email: "",
    username: "",
    password: ""
});
const regLoading = ref(false);

const handleRegister = () => {
    regForm.value.email = regForm.value.email.trim();
    regForm.value.password = regForm.value.password.trim();
    if (regForm.value.email === "" || regForm.value.password === "") {
        ElMessage.warning({
            message: "Email and password cannot be empty"
        })
        return;
    }
    regLoading.value = true;
    register({
        email: regForm.value.email, 
        username: regForm.value.username, 
        password: regForm.value.password
    }).then((res: any) => {
        const data = res.data;
        if (data.code === 0) {
            ElMessage.success({
                message: data.message,
            })
            router.push("/login");
        } else {
            ElMessage.error({
                message: data.message
            })
        }
        regLoading.value = false;
    })
};
</script>

<style scoped>
.reg-form-container {
    width: 100%;
    height: 100vh;
}
.reg-form {
    width: 25%;
    min-width: 250px;
    height: 200px;
}
.reg-btn {
    width: 100%;
}
.login-text {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
}
.login-btn {
    margin-left: 5px;
    color: var(--el-color-primary-light-3);
}
.login-btn:hover {
    color: var(--el-color-primary);
}
</style>