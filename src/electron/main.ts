import { app, BrowserWindow} from 'electron'
import path from 'path'
import { isDev } from './util.js';
import { registerIPC } from './ipc.js';
import { getPreloadPath } from './pathResolver.js';
import { RequestHandler } from './requestHandler.js';

let win: BrowserWindow;

const createWindow = async () => {
    win = new BrowserWindow({
        autoHideMenuBar: true,
        useContentSize: true,
        webPreferences: {
            contextIsolation: true,
            preload: getPreloadPath(),
            nodeIntegration: false,
            devTools: true,
        },
    });
    RequestHandler.getInstance().setWindow(win);

    if (isDev()) {
        await win.loadURL("http://localhost:5123/");
    } else {
        await win.loadFile(path.join(__dirname, "../../dist/index.html"));
    }
};

app.whenReady().then(() => {
    registerIPC(win);
    createWindow();
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});