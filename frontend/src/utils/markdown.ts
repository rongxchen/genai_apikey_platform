import { marked } from "marked";

const splitTextAndCode = (content: string) => {
    return content.split(/```/);
}

const checkCodeLang = (lang: string) => {
    if (!lang || lang.trim() === "") {
        return "plaintext";
    }
    const jsFrameworks = ['vue', 'react', 'angular', 'svelte'];
    if (jsFrameworks.includes(lang)) {
        return 'html';
    }
    return lang;
}

const prettifyCodeContent = (codeContent: string) => {
    const lines = codeContent.split('\n');
    const lang = lines[0];
    const code = lines.slice(1).map((s: string) => s).join('\n').trim();
    return {
        type: "code",
        content: code,
        lang: checkCodeLang(lang),
    }
}

export function parseMarkdown(content: string) {
    if (!content) {
        return [];
    }
    const splitContents = splitTextAndCode(content);
    const result: any[] = [];
    for (let i = 0; i < splitContents.length; i++) {
        const split = splitContents[i];
        if (i % 2 === 0) {
            const htmlContent = (marked(split) as string).trim();
            result.push({
                type: "html",
                content: htmlContent,
            });
        } else {
            result.push(prettifyCodeContent(split));
        }
    }
    return result;
}
