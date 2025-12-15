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

    return new Promise((resolve, reject) => {
        if (!this.win) {
            reject(new Error("No browser window present"));
            return;
        }

        let finished = false;

        let timer: NodeJS.Timeout;

        const finish = (fn: () => void) => {
            if (finished) return;
            finished = true;

            ipcMain.removeListener("inputResponse", onResponse);

            fn();
        };

        const onResponse = (
            evt: Electron.IpcMainEvent,
            data: { value: string }
        ) => {
            if (typeof data?.value !== "string") {
                finish(() => reject(new Error("Invalid input value")));
                return;
            }

            finish(() => resolve(data.value));
        };

        ipcMain.once("inputResponse", onResponse);

        this.win.webContents.send("requestInput", value);
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