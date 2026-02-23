<template>
    <div>
        <div class="login-form-container flex-center align-center">
            <div class="login-form">
                <el-form
                    :model="loginForm"
                >
                    <el-form-item>
                        <el-input
                            v-model="loginForm.email"
                            :placeholder="$t('login.emailPlaceholder')"
                            prefix-icon="User"
                        ></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-input
                            v-model="loginForm.password"
                            :placeholder="$t('login.passwordPlaceholder')"
                            type="password"
                            show-password
                            prefix-icon="Lock"
                        ></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-checkbox  
                            v-model="remember" 
                        ><span class="grey-text">{{ $t("login.remember") }}</span>
                        </el-checkbox>
                    </el-form-item>

                    <el-form-item>
                        <el-button
                            class="login-btn"
                            type="primary"
                            @click="handleLogin"
                        >{{ $t("login.loginBtn") }}</el-button>
                    </el-form-item>

                    <el-form-item>
                        <div class="register-text">
                            {{ $t("login.registerText") }}
                            <el-button
                                class="register-btn"
                                link
                                @click="$router.push('/signup')"
                            >{{ $t("login.registerBtn") }}</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UserLogin } from '@/api/user/model';
import { getCookie, setCookie, removeCookie } from "@/utils/cookie";
import { login, getUserInfo } from '@/api/user';
import { ElMessage } from 'element-plus';
import router from '@/router';
import Localstorage from '@/utils/localstorage';
import store from '@/store';
import { getAPIKeyProviderList } from '@/api/api_key';

const loginForm = ref<UserLogin>({
    email: "",
    password: ""
});
const remember = ref(false);

const handleLogin = () => {
    if (remember.value) {
        setCookie("email", loginForm.value.email, 365);
        setCookie("password", loginForm.value.password, 365);
    } else {
        removeCookie("email");
        removeCookie("password");
    }
    login(loginForm.value).then(async (res: any) => {
        const data = res.data;
        if (!data.code && data.token_type === "bearer") {
            Localstorage.setItem("accessToken", data.access_token, false, true);
            Localstorage.setItem("refreshToken", data.refresh_token, false, true);
            await getUserInfo().then((res: any) => {
                const data = res.data.data;
                Localstorage.setItem("userInfo", data, true, true);
                store.commit("setUserInfo", data);
            })
            await getAPIKeyProviderList().then((res: any) => {
                if (res.data.code === 0) {
                    store.commit("setProviders", res.data.data);
                }
            });
            ElMessage.success("Login success");
            router.push("/dashboard");
        } else {
            ElMessage.error(data.message);
        }
    });
}

onMounted(() => {
    const email = getCookie("email");
    const password = getCookie("password");
    if (email && password) {
        loginForm.value.email = email;
        loginForm.value.password = password;
        remember.value = true;
    }
})
</script>

<style scoped>
.login-form-container {
    width: 100%;
    height: 100vh;
}
.login-form {
    width: 25%;
    min-width: 250px;
    height: 200px;
}
.login-btn {
    width: 100%;
}
.register-text {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
}
.register-btn {
    margin-left: 5px;
    color: var(--el-color-primary-light-3);
}
.register-btn:hover {
    color: var(--el-color-primary);
}
</style>
