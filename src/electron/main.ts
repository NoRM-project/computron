import { app, BrowserWindow} from 'electron'
import path from 'path'
import { isDev } from './util.js';
import { registerIPC } from './ipc.js';
import { getPreloadPath } from './pathResolver.js';

const createWindow = async () => {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        useContentSize: true,
        webPreferences: {
            contextIsolation: true,
            preload: getPreloadPath(),
            nodeIntegration: false,
            devTools: true,
        },
    });

    if (isDev()) {
        await win.loadURL("http://localhost:5123/");
    } else {
        await win.loadFile(path.join(__dirname, "../../dist/index.html"));
    }
};

app.whenReady().then(() => {
    registerIPC();
    createWindow();
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});