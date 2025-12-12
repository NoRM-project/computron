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

    requestInputFromFrontend(): Promise<number> {
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
            };

            const onResponse = (evt: Electron.IpcMainEvent, data: { value: number }) => {
                if (typeof data?.value !== "number") {
                    return finish(() => reject(new Error("Invalid input value")));
                }
                finish(() => resolve(data.value));
            };

            // надсилаємо запит фронту
            this.win.webContents.send("requestInput");
            ipcMain.once("inputResponse", onResponse);

            // таймаут, якщо фронт не відповів
            const timer = setTimeout(() => {
                finish(() => reject(new Error("Frontend input timeout")));
            }, TIMEOUT_MS);

            // очистка у будь-якому випадку
            const cleanup = () => clearTimeout(timer);
            finish(() => cleanup());
        });
    }

    sendOutputToFrontend(val: string) {
        if (!this.win) {
            throw new Error("No browser window present");
        }

        this.win?.webContents.send(val)
    }

    setWindow(win: BrowserWindow) {
        this.win = win;
    }
}