const sleep = async (ms: number) => {
    await new Promise((r) => setTimeout(r, ms));
};

const img2DataUrl = (url: string): Promise<string> => {
    return new Promise((res) => {
        const img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                res("");
                return;
            }
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            res(dataURL);
        };
        img.onerror = () => {
            res("");
        };
        img.src = url;
    });
};

const ts2Date = (ts: number) => {
    const date = new Date(ts * 1000)
    return date.toLocaleString('en-us', { month: 'short', day: "numeric", year: 'numeric' })
}

const sanitizeUrl = (inp: string) => {
    try {
        const url = new URL(inp);
        const path = url.pathname;
        if (path.length <= 1) {
            url.pathname = "/"
        } else if (path.endsWith('/')) {
            url.pathname = path.slice(0, -1);
        }
        url.hash = ""
        return url.href;
    } catch (error) {
        return null;
    }
}

const sizeUnits = ["B", "KB", "MB", "GB", "TB", "PB"]
const formatSize = (size: number): string => {
    if (size === 0) return `0 ${sizeUnits[0]}`;
    const k = 1024
    const i = Math.floor(Math.log(size) / Math.log(k));
    const num = parseFloat((size / Math.pow(k, i)).toFixed(2))
    return `${num} ${sizeUnits[i]}`
}

const isValidOpenAIKey = (key: string): boolean => {
    const regex = /sk-[a-zA-Z0-9]{30,60}/;
    return regex.test(key);
}

const getDomainFromUrl = (url: string): string => {
    return new URL(url).hostname;
}

const extractHtmlContent = (inp: string): string => {
    const content = inp.replace(/\n+/g, '\n').replace(/\s+/g, ' ').trim();
    return content
}

export default {
    sleep,
    img2DataUrl,
    ts2Date,
    sanitizeUrl,
    formatSize,
    isValidOpenAIKey,
    getDomainFromUrl,
    extractHtmlContent,
};
