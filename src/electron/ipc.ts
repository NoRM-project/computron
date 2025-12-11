import { BrowserWindow, ipcMain } from "electron";
import { loadFile, saveFile } from "./services/fileService.js";
// імпортимо функції і класи з файликів бекенду (із розширенням .js саме так лол)

// тут безпосередньо прописуємо як бекенд має реагувати на кожний із івентів

// винести в окремий модуль
let currentFilePath = ""

export function registerIPC(win: BrowserWindow) {

    // якийсьмодульбеку.setOnUpdateCallback(() => contents.send("computronUpdate", state)) - ліпше винести так аби вся ipc логіка лишилась тут і тільки тут

    // тут потрібне має підставить бекендер
    ipcMain.on("compile", (evt, data: {
        plaintextCode: string;
        runAfterCompilation: boolean;  // Та, ви все правильно розумієте, ці типи прописуються окремо в трьох місцях, гарного дня, (#electron_typescript_<3_<3_<3)
    }) => {
        // TODO
    });

    ipcMain.on("run", (evt) => {
        console.log("Run program");
        // TODO
    });

    ipcMain.on("setRegister", (evt, data: {
        register: Register;
        value: number;
    }) => {
        console.log("Set register:", data.register, "value:", data.value);
        // TODO
    });


    ipcMain.on("setMemoryCell", (evt, data: {
        value: number;
    }) => {
        console.log("Set memory cell under PC to:", data.value);
        // TODO
    });


    // ipcMain.on("consoleInput", (evt, data: {
    //     value: number;
    // }) => {
    //     console.log("Console input:", data.value);
        
    // });

    ipcMain.handle("selectFile", async (evt, args: { path: string }) => {
        return loadFile(args.path);
    });

    ipcMain.handle("saveFile", async (evt, args: { newContent: string }) => {
        return saveFile(args.newContent);
    });
}
