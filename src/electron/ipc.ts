import { BrowserWindow, ipcMain, dialog, ipcRenderer } from "electron";
import { loadTextFile, saveTextFile } from "./services/fileService.js";
import { CPU } from "./compiler/cpu.js";
import { parseProgram } from "./parser/parser.js";
import { run, stop } from "./compiler/executer.js";

// тут безпосередньо прописуємо як бекенд має реагувати на кожний із івентів
export async function registerIPC(win: BrowserWindow) {
    const cpu = CPU.getInstance()

    // якийсьмодульбеку.setOnUpdateCallback(() => contents.send("computronUpdate", state)) - ліпше винести так аби вся ipc логіка лишилась тут і тільки тут

    // тут потрібне має підставить бекендер
    ipcMain.on("compile", (evt, data: {
        plaintextCode: string;
        runAfterCompilation: boolean;  // Та, ви все правильно розумієте, ці типи прописуються окремо в трьох місцях, гарного дня, (#electron_typescript_<3_<3_<3)
    }) => {
        const parseSuccess: boolean = parseProgram(data.plaintextCode, cpu);
        if (parseSuccess && data.runAfterCompilation) {
            console.log("Run program")
            run(cpu);
            console.log("Program has ended")
        }
    });

    ipcMain.on("run", (evt) => {
        console.log("Run program");
        run(cpu);
        console.log("Program has ended")
    });

    ipcMain.on("stop", (evt) => {
        console.log("Stop program");
        stop(cpu);
        console.log("Program stopped")
    });

    ipcMain.on("setRegister", (evt, data: {
        register: Register;
        value: number;
    }) => {
        console.log("Set register:", data.register, "value:", data.value);
        cpu.setRegister(data.value, data.register);
    });

    ipcMain.on("setMemoryCell", (evt, data: {
        value: number;
    }) => {
        console.log("Set memory cell under PC to:", data.value);
        const pc = cpu.getPC();
        cpu.setMemoryCell(data.value, pc)
    });

    ipcMain.handle("loadRamFromFile", async (evt, args: { path: string }) => {
        cpu.loadRamFromFile(args.path);
    });

    ipcMain.handle("saveRamToFile", async (evt, args: { path: string }) => {
        cpu.saveRamToFile(args.path);
    });

    ipcMain.handle("openFile", async (evt, args: { path: string }) => {
        return loadTextFile(args.path);
    });

    ipcMain.handle("saveFile", async (evt, args: { path: string, newContent: string }) => {
        return saveTextFile(args.path, args.newContent);
    });

    ipcMain.handle("getInitialComputronState", async (evt) => {
        return cpu.getState();
    });

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
