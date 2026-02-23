import LocalstorageUtil from "./localstorage";

class AuthUtil {
    constructor() {
        console.log("AuthUtil constructor");
    }

    getToken(name = "accessToken") {
        return LocalstorageUtil.getItem(name, false, true);
    }

    setToken(name: string, value: string) {
        LocalstorageUtil.setItem(name, value, false, true);
    }

    setUserInfo(user: any) {
        LocalstorageUtil.setItem("userInfo", user, true, true);
    }

    isAuthenticated() {
        return this.getToken() !== null;
    }
}

export default new AuthUtil();
