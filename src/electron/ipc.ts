import { BrowserWindow, ipcMain, dialog } from "electron";
import { loadBinaryFile, loadTextFile, saveBinaryFile, saveTextFile } from "./services/fileService.js";

// тут безпосередньо прописуємо як бекенд має реагувати на кожний із івентів
export async function registerIPC(win: BrowserWindow) {

    ipcMain.handle("openFile", async (evt, args: { path: string }) => {
        return loadTextFile(args.path);
    });

    ipcMain.handle("saveFile", async (evt, args: { path: string, newContent: string }) => {
        return saveTextFile(args.path, args.newContent);
    });

    ipcMain.handle("loadBinaryFile", async (evt, args: { path: string }) => {
        return loadBinaryFile(args.path);
    });

    ipcMain.handle("saveBinaryFile", async (evt, args: { path: string, content: ArrayBuffer }) => {
        return saveBinaryFile(args.path, args.content);
    })

    ipcMain.handle("askSavingPath", async (event, options?: Electron.SaveDialogOptions) => {
        const win = BrowserWindow.fromWebContents(event.sender);

        const dialogOptions: Electron.SaveDialogOptions = {
            title: "Save file",
            ...options,
        };

        const result = win
            ? await dialog.showSaveDialog(win, dialogOptions)   // overload with window
            : await dialog.showSaveDialog(dialogOptions);       // overload without window

        return result.canceled ? null : (result.filePath ?? null);
    });

    ipcMain.handle("askOpenFilePath", async (event, options?: Electron.OpenDialogOptions) => {
        const win = BrowserWindow.fromWebContents(event.sender);

        const dialogOptions: Electron.OpenDialogOptions = {
            title: "Open file",
            properties: ["openFile"],
            ...options,
        };

        const result = win
            ? await dialog.showOpenDialog(win, dialogOptions)
            : await dialog.showOpenDialog(dialogOptions);

        if (result.canceled || result.filePaths.length === 0) return null;
        return result.filePaths[0]; // single file path
    });

}
