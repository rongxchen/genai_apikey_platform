import { createStore } from 'vuex'
import { useDark } from "@vueuse/core"
import Localstorage from '@/utils/localstorage';
import Datetime from '@/utils/date';

export default createStore({
  state: {
    userInfo: {},
    chats: new Map<string, any>(),
    currChat: {},
    lang: 'en',
    isDark: useDark().value,
    providers: new Array<any>(),
    currModel: Localstorage.getItem('currModel') || '',
    currProvider: Localstorage.getItem('currProvider') || '',
  },
  getters: {
    userInfo: (state) => state.userInfo,
    chats: (state) => state.chats,
    currChat: (state) => state.currChat,
    lang: (state) => state.lang,
    isDark: (state) => state.isDark,
    providers: (state) => state.providers,
    currModel: (state) => state.currModel,
    currProvider: (state) => state.currProvider,
  },
  mutations: {
    setUserInfo(state, payload) {
      state.userInfo = payload;
    },
    addChats(state, chats: Array<any>) {
      chats.forEach((chat: any) => {
        if (state.chats.has(chat.chatId)) {
          Object.keys(state.chats.get(chat.chatId)).forEach((key) => {
            if (chat[key] !== undefined) {
              state.chats.get(chat.chatId)[key] = chat[key];
            }
          })
        } else {
          state.chats.set(chat.chatId, chat);
        }
      })
    },
    updateChatTime(state, chatId: string) {
      if (state.chats.has(chatId)) {
        state.chats.get(chatId).updated_at = new Date().getTime();
        state.chats.get(chatId).datetime = new Datetime(state.chats.get(chatId).updated_at);
      }
    },
    updateChatTitle(state, {chatId, title}) {
      if (state.chats.has(chatId)) {
        state.chats.get(chatId).title = title;
      }
    },
    removeChat(state, chatId: string) {
      if (state.chats.has(chatId)) {
        state.chats.delete(chatId);
      }
    },
    setCurrChat(state, chat: any) {
      state.currChat = chat;
    },
    setLang(state, lang: string) {
      state.lang = lang;
    },
    changeTheme(state) {
      state.isDark = !state.isDark  
    },
    setProviders(state, providers: Array<any>) {
      state.providers = providers;
      if (state.currModel === '' || !state.currModel) {
        for (const provider of providers) {
          if (!provider.disabled) {
            state.currModel = provider.models[0].model;
            state.currProvider = provider.name;
            Localstorage.setItem('currModel', state.currModel, false, false);
            Localstorage.setItem('currProvider', state.currProvider, false, false);
            break;
          }
        }
      }
    },
    setCurrModel(state, model: string) {
      state.currModel = model;
    },
    setCurrProvider(state, provider: string) {
      state.currProvider = provider;
    },
    clear(state) {
      state.userInfo = {};
      state.chats = new Map<string, any>();
      state.currChat = {};
      state.lang = 'en';
      state.isDark = useDark().value;
      state.providers = new Array<any>();
      state.currModel = '';
      state.currProvider = '';
    }
  },
  actions: {
  },
  modules: {
  }
})
