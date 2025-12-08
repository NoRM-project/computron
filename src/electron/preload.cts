import {contextBridge, ipcRenderer} from "electron";

// ВАЖЛИВО: якщо захочете тут щось міняти, міняйте і типи для інтерфейсу Window у types.d.ts  (#electron_typescript_<3_<3_<3)

// Оце все запускається з фронтенду через window.electronAPI.назвафункції

contextBridge.exposeInMainWorld("electronAPI", {
    // send означає що ми просто посилаємо повідомлення і не очікуємо на відповідь
    compile: (plaintextCode: string, runAfterCompilation: boolean) => ipcRenderer.send("compile", {plaintextCode, runAfterCompilation}), // відправити код на компіляцію (і загрузити результат в меморі), булєвський параметр чи запускати програму
    run: () => ipcRenderer.send("run"), // запустити виконання програми
    setRegister: (register: Register, value: number) => ipcRenderer.send("setRegister", {register, value}), // наставити регістр такіто на значення такето
    setMemoryCell: (value: number) => ipcRenderer.send("setMemoryCell", {value}), // наставити ячейку пам'яті під програм каунтером на значення
    consoleInput: (value: number) => ipcRenderer.send("consoleInput", {value}), // передати ввід з консолі
    
    // інвоук означає що ми чекаємо на відповідь хендлера і результат який він нам верне. В даному випадку успіх/неуспіх і зміст файлу
    selectFile: (path: string) => ipcRenderer.invoke("selectFile", {path}), // тут параметри залежать від того чи хочете ви таби. Один із параметрів точно path вибраного файлу. Як ретурн успіх/неуспіх і контент файлу
    saveFile: (newContent: string) => ipcRenderer.invoke("saveFile", {newContent}), // зберегти файл з яким ми моментально працюємо. Ретурн це успіх/неуспіх. Наполягаю не робити таби аби не ускладнювати


    // Як це працює:
    // onComputronUpdate є фактично сеттером колбек функції яка запуститься коли в ipc виникне івент computronUpdate, тобто коли десь запуститься ipcRenderer.send("computronUpdate", {state})
    // Тобто в реакті ти прописуєш функцію, яка хендлить подію коли бек відправляє оновлення свого статусу. Потім цю функцію передаєш як параметр до onComputronUpdate
    onComputronUpdate: (cb: (state: ComputronState) => void) => {
        const handler = (_: any, state: ComputronState) => cb(state);
        ipcRenderer.on("computronUpdate", handler);
        return () => ipcRenderer.removeListener("computronUpdate", handler);
    },
    // аутпут, який має бути виведений в консоль
    onConsoleOutput: (cb: (value: number) => void) => {
        const handler = (_: any, value: number) => cb(value);
        ipcRenderer.on("onConsoleOutput", handler);
        return () => ipcRenderer.removeListener("onConsoleOutput", handler);
    }
})