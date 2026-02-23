import { UserLogin, UserRegister } from "./model";
import axiosInstance from "@/utils/request";

export async function login(data: UserLogin) {
    return axiosInstance.post(
        "/api/oauth2/token",
        { username: data.email, password: data.password },
        { headers: {"Content-Type": "application/x-www-form-urlencoded"} }
    );
}

export async function register(data: UserRegister) {
    return axiosInstance.post("/api/users/register", data);
}

export async function getUserInfo() {
    return axiosInstance.get("/api/users/me");
}
