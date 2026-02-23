import axiosInstance from "@/utils/request";

export function getMessages(chatId: string, skip: number, limit: number) {
    return axiosInstance.get(
        `/api/chats/${chatId}/messages`,
        { params: { skip: skip, limit: limit } }
    );
}
