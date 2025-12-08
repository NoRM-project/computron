import fs from "fs";

let currentFilePath = "";

export function setCurrentFilePath(path: string) {
    currentFilePath = path;
}

export function getCurrentFilePath() {
    return currentFilePath;
}

export function loadFile(path: string): SelectFileResult {
    try {
        const content = fs.readFileSync(path, "utf8");
        currentFilePath = path;
        return { success: true, content };
    } catch (err) {
        console.error(err);
        return { success: false };
    }
}

export function saveFile(newContent: string): { success: boolean } {
    try {
        fs.writeFileSync(currentFilePath, newContent);
        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false };
    }
}