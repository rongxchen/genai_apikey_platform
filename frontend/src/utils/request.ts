import { BACKEND_URL } from "@/constant";
import axios, { InternalAxiosRequestConfig } from "axios";
import AuthUtil from "./auth";
import LocalstorageUtil from "./localstorage";

const axiosInstance = axios.create({baseURL: BACKEND_URL, withCredentials: false});
const excludes = ["/api/user/change-password"];

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
        if (excludes.includes(config.url || "")) {
            return config;
        }
        const token = AuthUtil.getToken("accessToken");
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

let refreshTokenRetry = false;

const refreshToken = async () => {
    const token = AuthUtil.getToken("refreshToken");
    if (!token) {
        return null;
    }
    const resp = await axios.post(BACKEND_URL + "/api/oauth2/refresh-token", {
        grant_type: "refresh_token", refresh_token: token
    });
    if (resp.status === 200 && resp.data.access_token) {
        refreshTokenRetry = false;
        return resp.data.access_token;
    }
    return null;
}

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.code == "ERR_CANCELED") {
            return Promise.reject(error);
        }
        const originalRequest = error.config;
        if (error.response.status === 401 && !refreshTokenRetry) {
            refreshTokenRetry = true;
            const accessToken = await refreshToken();
            if (!accessToken) {
                LocalstorageUtil.removeItem("accessToken", true);
                LocalstorageUtil.removeItem("refreshToken", true);
                LocalstorageUtil.removeItem("userInfo", true);
                window.location.reload();
                return Promise.reject(error);
            }
            AuthUtil.setToken("accessToken", accessToken);          
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;
