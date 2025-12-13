import fs from "fs";


export function loadTextFile(path: string): FileResult<string> {
    try {
        const data = fs.readFileSync(path, "utf8");
        return { success: true, data };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

export function saveTextFile(path: string, content: string): FileResult<void> {
    try {
        fs.writeFileSync(path, content, "utf8");
        return { success: true, data: undefined };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

export function loadBinaryFile(path: string): FileResult<Buffer> {
    try {
        const data = fs.readFileSync(path);
        return { success: true, data };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

export function saveBinaryFile(path: string, buffer: Buffer): FileResult<void> {
    try {
        fs.writeFileSync(path, buffer);
        return { success: true, data: undefined };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}