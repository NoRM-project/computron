import React, { createContext, useContext, useEffect, useState } from "react";
// import {Connect} from "vite";



type ConsoleData = {
    type: 'in' | 'out';
    value: string;
};

type File = {
    path: string;
    name: string;
    content: string;
}

// До цього обєкту ви матимете доступ з будь якого компоненту, для використання достаньо використати хук на useComputron() 
// Приклад: const { state, compile, run, consoleOutput } = useComputron();
// PS я не до кінця впевнена що треба а що ні, тому якщо що треба буде розширювати
type ComputronContextType = {
    // поточний стан компутрона
    state: ComputronState | null;
    files: File[];

    // Console -----------------------------------------
    // поле значень в консолі, при вводі тип інпут, з беку іде аутпут
    consoleOutput: ConsoleData[];
    // функція для очистки консолі, просто для зручності
    cleanConsole: () => void;
    // передати ввід з консолі
    consoleInput: (value: string) => void;
    // змінна яка визначає чи потрібен ввід в консоль
    inputRequested: InputType;

    // Files -------------------------------------------
    // скомпілювати (опціонально ранити) актуальний файл
    compile: (code: string, run: boolean) => void;
    // наразі я погано розумію як нам працювати з файлами в плані відкрити, закрити
    // заготовка передбачає збереження файлів на фронті у вигляді масивів з данних і пасів, але це було б непогано додатково обговорити
    //TODO

    // Memory and Registers
    // запустити програму
    run: () => void;
    // наставити регістр такіто на значення такето
    setRegister: (reg: Register, value: number) => void;
    // наставити ячейку пам'яті під програм каунтером на значення
    setMemoryCell: (value: number) => void;

    loadRam: () => void;
    storeRam: () => void;
};




const ComputronContext = createContext<ComputronContextType | undefined>(undefined);

export const ComputronProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {

    const handleComputronUpdate = (value: ComputronState) => {
        console.log(value);
        setState(value);
    }

    const handleLoad = () => {
        window.electronAPI.askOpenFilePath({
            filters: [
                { name: "Binary files", extensions: ["bin"] },
                { name: "All Files", extensions: ["*"] },
            ]
        }).then(path => {
            if (path) {
                window.electronAPI.loadRamFromFile(path);
            } else {
                console.error("Failed to load Ram");
            }
        })
    };

    const handleStore = () => {
        window.electronAPI.askSavingPath({
            defaultPath: "memory.bin",
            filters: [
                { name: "Binary files", extensions: ["bin"] },
                { name: "All Files", extensions: ["*"] },
            ]
        }).then(path => {
            if (path) {
                window.electronAPI.saveRamToFile(path);
            } else {
                console.error("Failed to save Ram");
            }
        })
    };

    const [state, setState] = useState<ComputronState | null>(null);
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        let alive = true;

        (async () => {
            const initial = await window.electronAPI.getInitialComputronState();
            if (alive) setState(initial);
            console.log(initial);
        })();

        return () => { alive = false; };
    }, []);

    const [consoleOutput, setConsoleOutput] = useState<ConsoleData[]>([]);
    const [inputRequested, setInputRequested] = useState<InputType>(null);

    
    const cleanConsole = () => setConsoleOutput([]);

    useEffect(() => {
        const unsubscribeUpdate = window.electronAPI.onComputronUpdate(handleComputronUpdate);
        const unsubscribeConsole = window.electronAPI.onConsoleOutput((value) => {
            setConsoleOutput(prev => [...prev, { type: 'out', value }]);
        });
        const unsubscribeInput = window.electronAPI.onRequestInput((type:InputType) => setInputRequested(type));

        return () => {
            unsubscribeUpdate();
            unsubscribeConsole();
            unsubscribeInput();
        };
    }, []);

    const value: ComputronContextType = {
        state,
        files,
        consoleOutput,
        inputRequested,
        compile: window.electronAPI.compile,
        cleanConsole,
        run: window.electronAPI.run,
        setRegister: window.electronAPI.setRegister,
        setMemoryCell: window.electronAPI.setMemoryCell,
        consoleInput: (value:string)=>{
            setInputRequested(null);
            window.electronAPI.consoleInput(value);
        },
        loadRam: handleLoad,
        storeRam: handleStore,
    };

    return <ComputronContext.Provider value={value}>{children}</ComputronContext.Provider>;
};

export const useComputron = () => {
    const context = useContext(ComputronContext);
    if (!context) throw new Error("useComputron must be used within ComputronProvider");
    return context;
};
