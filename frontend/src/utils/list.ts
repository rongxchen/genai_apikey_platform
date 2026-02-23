export function existInList(list: Array<any>, key: string, value: string) {
    for (const item of list) {
        if (item[key] === value) {
            return true;
        }
    }
    return false;
}

export function getFromList(list: Array<any>, key: string, value: string) {
    for (const item of list) {
        if (item[key] === value) {
            return item;
        }
    }
    return null;
}

export function removeFromList(list: Array<any>, key: string, value: string) {
    return list.filter((item) => item[key] !== value);
}
