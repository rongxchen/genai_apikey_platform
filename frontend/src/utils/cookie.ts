export function getCookie(key: string) {
    const cookie = document.cookie;
    const cookieArr = cookie.split("; ");
    for (let i = 0; i < cookieArr.length; i++) {
        const arr = cookieArr[i].split("=");
        if (arr[0] === key) {
            return arr[1];
        }
    }
    return null;
}

export function setCookie(key: string, value: string, days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    document.cookie = `${key}=${value};expires=${date.toUTCString()}`;
}

export function removeCookie(key: string) {
    setCookie(key, "", -1);
}
