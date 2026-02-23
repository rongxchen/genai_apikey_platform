class LocalStorage {
    constructor() {
        console.log("LocalStorage constructor");
    }

    getLang() {
        const res = this.getItem("lang", false, false) as string;
        return res || "en";
    }

    setLang(lang: string) {
        this.setItem("lang", lang, false, false);
    }

    getCurrentUser() {
        const res = localStorage.getItem("userInfo");
        return res ? JSON.parse(res) : null;
    }

    getCurrentUserId() {
        const user = this.getCurrentUser();
        return user ? user["user_id"] : null;
    }

    getCurrentUserData() {
        const userId = this.getCurrentUserId();
        const data = userId ? localStorage.getItem(userId) : null;
        return data ? JSON.parse(data) : {};
    }

    getItem(key: string, isJson = false, isCommon = false) {
        let res = null;
        if (isCommon) {
            res = localStorage.getItem(key);
        } else {
            const userData = this.getCurrentUserData();
            res = userData ? userData[key] : null;
        }
        if (isJson) {
            try {
                res = JSON.parse(res);
            } catch (e) {
                res = null;
            }
        }
        return res;
    }

    setItem(key: string, value: any, isJson = false, isCommon = false) {
        let toBeSaved = value;
        if (isJson) {
            toBeSaved = JSON.stringify(value);
        }
        if (isCommon) {
            localStorage.setItem(key, toBeSaved);
        } else {
            const userId = this.getCurrentUserId();
            const userData = this.getCurrentUserData();
            if (userId) {
                userData[key] = value;
                localStorage.setItem(userId, JSON.stringify(userData));
            }
        }
    }

    removeItem(key: string, isCommon = false) {
        if (isCommon) {
            localStorage.removeItem(key);
        } else {
            const userId = this.getCurrentUserId();
            const userData = this.getCurrentUserData();
            if (userId) {
                delete userData[key];
                localStorage.setItem(userId, JSON.stringify(userData));
            }
        }
    }
}

export default new LocalStorage();
