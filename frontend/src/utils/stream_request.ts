import { BACKEND_URL } from "@/constant";
import Localstorage from "./localstorage";
import { getUserInfo } from "@/api/user";

class StreamInstance {
    url: string = BACKEND_URL;
    headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + Localstorage.getItem("accessToken", false, true)
    }
    retry = false;

    constructor() {
        console.log('StreamInstance constructor');
    }

    private parseStreamData(data: Uint8Array | undefined, isJson = true) {
        const msg = new TextDecoder("utf-8").decode(data).replaceAll("data: ", "").trim();
        const chunks = msg.split("}{");
        if (chunks.length > 1) {
            chunks[0] = chunks[0] + "}";
            chunks[chunks.length - 1] = "{" + chunks[chunks.length - 1];
            for (let i = 1; i < chunks.length - 1; i++) {
                chunks[i] = "{" + chunks[i] + "}";
            }
            if (isJson) {
                return chunks.map((chunk: any) => JSON.parse(chunk));
            }
            return chunks;
        }
        if (isJson) {
            return JSON.parse(msg);
        }
        return msg;
    }

    private async request(method: string, path: string, body: any = null, callback: (data: any) => Promise<any>) {
        const url = this.url + path;
        if (!(body instanceof String)) {
            body = JSON.stringify(body);
        }
        await fetch(url, {
            method: method,
            headers: this.headers,
            body: body
        }).then(async (response) => {
            if (response.status === 401) {
                if (!this.retry) {
                    this.retry = true;
                    await getUserInfo();
                    this.headers["Authorization"] = "Bearer " + Localstorage.getItem("accessToken", false, true);
                    this.request(method, path, body, callback);
                } else {
                    return;
                }
            }
            if (response.body === null) {
                throw new Error('Response body is null');
            }
            const reader = response.body.getReader();
            const TRUE = true;
            while (TRUE) {
                const { value, done } = await reader.read();
                if (done) break;
                const res = this.parseStreamData(value, true);
                if (res instanceof Array) {
                    for (const r of res) {
                        await callback(r);
                    }
                } else {
                    await callback(res);
                }
            }
        })
    }

    async get(path: string, callback: (data: any) => Promise<any>) {
        await this.request('GET', path, null, callback);
    }

    async post(path: string, data: any = null, callback: (data: any) => Promise<any>) {
        await this.request('POST', path, data, callback);
    }
}

export default StreamInstance;
