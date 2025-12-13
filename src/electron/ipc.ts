import { BrowserWindow, ipcMain } from "electron";
import { loadTextFile, saveTextFile } from "./services/fileService.js";
import { CPU } from "./compiler/cpu.js";
import run from "./compiler/executer.js";
import { parseProgram } from "./parser/parser.js";

// тут безпосередньо прописуємо як бекенд має реагувати на кожний із івентів
export function registerIPC(win: BrowserWindow) {
    const cpu = CPU.getInstance()

    // якийсьмодульбеку.setOnUpdateCallback(() => contents.send("computronUpdate", state)) - ліпше винести так аби вся ipc логіка лишилась тут і тільки тут

    // тут потрібне має підставить бекендер
    ipcMain.on("compile", (evt, data: {
        plaintextCode: string;
        runAfterCompilation: boolean;  // Та, ви все правильно розумієте, ці типи прописуються окремо в трьох місцях, гарного дня, (#electron_typescript_<3_<3_<3)
    }) => {
        parseProgram(data.plaintextCode, cpu);
        if (data.runAfterCompilation) {
            run(cpu);
        }
    });

    ipcMain.on("run", (evt) => {
        console.log("Run program");
        run(cpu);
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

    ipcMain.handle("selectFile", async (evt, args: { path: string }) => {
        return loadTextFile(args.path);
    });

    ipcMain.handle("saveFile", async (evt, args: { path: string, newContent: string }) => {
        return saveTextFile(args.path, args.newContent);
    });

    ipcMain.handle("getInitialComputronState", async (evt) => {
        return cpu.getState();
    });
}
