import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import * as Icons from '@element-plus/icons-vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { en as elEn } from 'element-plus/es/locale/index';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { createI18n } from 'vue-i18n';
import en from './international/en';
import zh from './international/zh';
import Localstorage from './utils/localstorage';
import "./App.css";
import { getAPIKeyProviderList } from './api/api_key';
import { VueCodeHighlighter, VueCodeHighlighterMulti } from 'vue-code-highlighter';
import 'vue-code-highlighter/dist/style.css'
import { getUserInfo } from './api/user';

const lang = Localstorage.getLang();
if (lang) {
    store.commit('setLang', lang);
}
const i18n = createI18n({
    locale: lang,
    messages: {
        en: {
            ...en,
            ...elEn,
        },
        zh: {
            ...zh,
            ...zhCn,
        }
    },
});

const app = createApp(App).use(i18n).use(store).use(router).use(ElementPlus).use(Antd);

for (const [key, component] of Object.entries(Icons)) {
    app.component(key, component)
}
app.component('VueCodeHighlighter', VueCodeHighlighter);
app.component('VueCodeHighlighterMulti', VueCodeHighlighterMulti);

const main = async () => {
    const token = Localstorage.getItem("accessToken", false, true);
    if (token) {
        await getUserInfo().then((res: any) => {
            if (res.data.code === 0) {
                store.commit('setUserInfo', res.data.data);
            }
        })
        getAPIKeyProviderList().then((res: any) => {
            if (res.data.code === 0) {
                store.commit("setProviders", res.data.data);
            }
        });
    }
}

main().then(() => {
    app.mount('#app');
})
