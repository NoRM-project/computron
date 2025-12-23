import {contextBridge, ipcMain, ipcRenderer} from "electron";

// ВАЖЛИВО: якщо захочете тут щось міняти, міняйте і типи для інтерфейсу Window у types.d.ts  (#electron_typescript_<3_<3_<3)

// Оце все запускається з фронтенду через window.electronAPI.назвафункції

contextBridge.exposeInMainWorld("electronAPI", {
    openFile: (path: string) => ipcRenderer.invoke("openFile", {path}), // тут параметри залежать від того чи хочете ви таби. Один із параметрів точно path вибраного файлу. Як ретурн успіх/неуспіх і контент файлу
    saveFile: (path: string, newContent: string) => ipcRenderer.invoke("saveFile", {path, newContent}), // зберегти файл з яким ми моментально працюємо. Ретурн це успіх/неуспіх. Наполягаю не робити таби аби не ускладнювати

    loadBinaryFile: (path: string): Promise<FileResult<ArrayBuffer>> => ipcRenderer.invoke("loadBinaryFile", {path}),
    saveBinaryFile: (path: string, content: ArrayBuffer): Promise<FileResult<void>> => ipcRenderer.invoke("saveBinaryFile", {path, content}),

    askOpenFilePath: (options?: Electron.OpenDialogOptions) => ipcRenderer.invoke("askOpenFilePath", options),
    askSavingPath: (options?: Electron.SaveDialogOptions) => ipcRenderer.invoke("askSavingPath", options),
})