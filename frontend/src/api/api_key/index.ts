import axiosInstance from "@/utils/request";

export function getAPIKeyList(skip: number, limit: number) {
    return axiosInstance.get(
        "/api/api-keys",
        { params: { skip: skip, limit: limit } }
    );
}

export function getAPIKeyProviderList() {
    return axiosInstance.get("/api/api-keys/providers");
}

export function createAPIKey(data: { provider: string, key: string }){
    return axiosInstance.post("/api/api-keys", data);
} 

export function deleteAPIKey(apiKeyId: string) {
    return axiosInstance.delete(`/api/api-keys/${apiKeyId}`);
}

export function setDefaultAPIKey(provider: string, apiKeyId: string) {
    return axiosInstance.put(`/api/api-keys/${provider}/${apiKeyId}/default`);
}
