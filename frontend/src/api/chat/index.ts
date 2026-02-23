import axiosInstance from "@/utils/request";

export function getChats(skip: number, limit: number) {
    return axiosInstance.get(
        "/api/chats",
        { params: { skip: skip, limit: limit } }
    )
}

export function updateChatTitle(chatId: string, title: string) {
    return axiosInstance.put(
        "/api/chats/" + chatId,
        { title: title }
    )
}

export function getChat(chatId: string) {
    return axiosInstance.get(
        "/api/chats/" + chatId,
    )
}

export function deleteChat(chatId: string) {
    return axiosInstance.delete(
        "/api/chats/" + chatId,
    )
}
