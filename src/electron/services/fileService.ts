import fs from "fs";
import path from "path"


export function loadTextFile(filePath: string): FileResult<ProgramFile> {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        const file: ProgramFile = {
            path: filePath,
            content: data,
            name: path.basename(filePath)
        }
        return { success: true, data: file };
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