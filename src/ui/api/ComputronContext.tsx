import React, { createContext, useContext, useEffect, useState } from "react";

type ConsoleData = {
    type: 'in' | 'out';
    value: string;
};

type File = {
    path: string;
    content: string;
}

// До цього обєкту ви матимете доступ з будь якого компоненту, для використання достаньо використати хук на useComputron() 
// Приклад: const { state, compile, run, consoleOutput } = useComputron();
// PS я не до кінця впевнена що треба а що ні, тому якщо що треба буде розширювати
type ComputronContextType = {
    // поточний стан компутрона
    state: ComputronState | null;

    // Console -----------------------------------------
    // поле значень в консолі, при вводі тип інпут, з беку іде аутпут
    consoleOutput: ConsoleData[];
    // функція для очистки консолі, просто для зручності
    cleanConsole: () => void;
    // передати ввід з консолі
    consoleInput: (value: number) => void;
    //
    inputRequested: boolean;
    //TODO

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
};

const ComputronContext = createContext<ComputronContextType | undefined>(undefined);

export const ComputronProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {

    const handleComputronUpdate = (value: ComputronState) => {
        console.log(value);
        setState(value);
    }

    const [state, setState] = useState<ComputronState | null>(null);
    const [consoleOutput, setConsoleOutput] = useState<ConsoleData[]>([]);
    const [inputRequested, setInputRequested] = useState<boolean>(false);

    
    const cleanConsole = () => setConsoleOutput([]);

    useEffect(() => {
        const unsubscribeUpdate = window.electronAPI.onComputronUpdate(handleComputronUpdate);
        const unsubscribeConsole = window.electronAPI.onConsoleOutput((value) => {
            setConsoleOutput(prev => [...prev, { type: 'out', value }]);
        });

        return () => {
            unsubscribeUpdate();
            unsubscribeConsole();
        };
    }, []);

    const value: ComputronContextType = {
        state,
        consoleOutput,
        inputRequested,
        compile: window.electronAPI.compile,
        cleanConsole,
        run: window.electronAPI.run,
        setRegister: window.electronAPI.setRegister,
        setMemoryCell: window.electronAPI.setMemoryCell,
        consoleInput: window.electronAPI.consoleInput,
    };

    return <ComputronContext.Provider value={value}>{children}</ComputronContext.Provider>;
};

export const useComputron = () => {
    const context = useContext(ComputronContext);
    if (!context) throw new Error("useComputron must be used within ComputronProvider");
    return context;
};
