import { BrowserWindow, ipcMain } from "electron";

export class RequestHandler {
    private static instance: RequestHandler | null = null;
    private win: BrowserWindow | null = null;

    private constructor() {}

    public static getInstance(): RequestHandler {
        if (RequestHandler.instance === null) {
            RequestHandler.instance = new RequestHandler();
        }
        return RequestHandler.instance;
    }

    requestInputFromFrontend(value: InputType): Promise<string> {
        const TIMEOUT_MS = 10000;

        return new Promise((resolve, reject) => {
            if (!this.win) {
                return reject(new Error("No browser window present"));
            }

            let finished = false;

            const finish = (fn: () => void) => {
                if (finished) return;
                finished = true;
                fn();
                clearTimeout(timer);
                ipcMain.removeListener("inputResponse", onResponse);
            }

            const onResponse = (evt: Electron.IpcMainEvent, data: { value: string }) => {
                if (typeof data?.value !== "number") {
                    return finish(() => reject(new Error("Invalid input value")));
                }
                finish(() => resolve(data.value));
            }

            // надсилаємо запит фронту з усіма перевірками (!)
            this.win.webContents.send("requestInput", value);
            ipcMain.once("inputResponse", onResponse);
            const timer = setTimeout(() => {
                finish(() => reject(new Error("Frontend input timeout")));
            }, TIMEOUT_MS);
            const cleanup = () => clearTimeout(timer);
            finish(() => cleanup());
        });
    }

    sendOutputToFrontend(val: string) {
        if (!this.win) {
            throw new Error("No browser window present");
        }

        this.win?.webContents.postMessage("consoleOutput", val);
    }

    sendComputronUpdate(newState: ComputronState) {
        if (!this.win) {
            throw new Error("No browser window present");
        }

        this.win?.webContents.postMessage("computronUpdate", newState);
    }

    sendCompilationError(error: string, line: number) {
        if (!this.win) {
            throw new Error("No browser window present");
        }
        const value: CompilationError = {error: error, line: line};
        
        this.win?.webContents.postMessage("compilationError", value);
    }
    
    sendExecutionError(error: string, pc: number) {
        if (!this.win) {
            throw new Error("No browser window present");
        }
        const value: ExecutionError = {error: error, pc: pc};
        
        this.win?.webContents.postMessage("executionError", value);
    }

    setWindow(win: BrowserWindow) {
        this.win = win;
    }
}