import {contextBridge, ipcMain, ipcRenderer} from "electron";

// ВАЖЛИВО: якщо захочете тут щось міняти, міняйте і типи для інтерфейсу Window у types.d.ts  (#electron_typescript_<3_<3_<3)

// Оце все запускається з фронтенду через window.electronAPI.назвафункції

contextBridge.exposeInMainWorld("electronAPI", {
    // send означає що ми просто посилаємо повідомлення і не очікуємо на відповідь

    // відправити код на компіляцію (і загрузити результат в меморі), булєвський параметр чи запускати програму
    compile: (plaintextCode: string, runAfterCompilation: boolean) => ipcRenderer.send("compile", {plaintextCode, runAfterCompilation}), 
    // запустити виконання програми
    run: () => ipcRenderer.send("run"), 
    // наставити регістр такіто на значення такето
    setRegister: (register: Register, value: number) => ipcRenderer.send("setRegister", {register, value}),
    // наставити ячейку пам'яті під програм каунтером на значення
    setMemoryCell: (value: number) => ipcRenderer.send("setMemoryCell", {value}),
    // передати ввід з консолі
    consoleInput: (value: string) => ipcRenderer.send("consoleInput", {value}),
    
    // інвоук означає що ми чекаємо на відповідь хендлера і результат який він нам верне. В даному випадку успіх/неуспіх і зміст файлу
    openFile: (path: string) => ipcRenderer.invoke("openFile", {path}), // тут параметри залежать від того чи хочете ви таби. Один із параметрів точно path вибраного файлу. Як ретурн успіх/неуспіх і контент файлу
    saveFile: (path: string, newContent: string) => ipcRenderer.invoke("saveFile", {path, newContent}), // зберегти файл з яким ми моментально працюємо. Ретурн це успіх/неуспіх. Наполягаю не робити таби аби не ускладнювати

    loadRamFromFile: (path: string) => ipcRenderer.invoke("loadRamFromFile", {path}), // завантажити пам'ять з файлу
    saveRamToFile: (path: string) => ipcRenderer.invoke("saveRamToFile", {path}), // зберегти пам'ять в файл

    getInitialComputronState: () => ipcRenderer.invoke("getInitialComputronState"),

    askOpenFilePath: (options?: Electron.OpenDialogOptions) => ipcRenderer.invoke("askOpenFilePath", options),
    askSavingPath: (options?: Electron.SaveDialogOptions) => ipcRenderer.invoke("askSavingPath", options),


    // Як це працює:
    // onComputronUpdate є фактично сеттером колбек функції яка запуститься коли в ipc виникне івент computronUpdate, тобто коли десь запуститься ipcRenderer.send("computronUpdate", {state})
    // Тобто в реакті ти прописуєш функцію, яка хендлить подію коли бек відправляє оновлення свого статусу. Потім цю функцію передаєш як параметр до onComputronUpdate
    onComputronUpdate: (cb: (state: ComputronState) => void) => {
        const handler = (_: any, state: ComputronState) => cb(state);
        ipcRenderer.on("computronUpdate", handler);
        return () => ipcRenderer.removeListener("computronUpdate", handler);
    },
    // аутпут, який має бути виведений в консоль
    onConsoleOutput: (cb: (value: string) => void) => {
        const handler = (_: any, value: string) => cb(value);
        ipcRenderer.on("consoleOutput", handler);
        return () => ipcRenderer.removeListener("consoleOutput", handler);
    },
    onRequestInput: (cb: (value: InputType) => void) => {
        const handler = (_: any, value: InputType) => cb(value);
        ipcRenderer.on("requestInput", handler);
        return () => ipcRenderer.removeListener("requestInput", handler);
    }
})