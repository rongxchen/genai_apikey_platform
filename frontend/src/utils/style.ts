export function buildOverflowContentStyle(lines: number): {
    "display": string,
    "-webkit-line-clamp": string,
    "-webkit-box-orient": string,
    "overflow": string,
    "text-overflow": string,
} {
    return {
        'display': '-webkit-box',
        '-webkit-line-clamp': `${lines}`,
        '-webkit-box-orient': 'vertical',
        'overflow': 'hidden',
        'text-overflow': 'ellipsis',
    }
}
