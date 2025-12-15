import React, { createContext, useContext, useEffect, useState } from "react";
// import {Connect} from "vite";
// import path from "path";

export type ConsoleData = {
    type: 'in' | 'out' | 'err';
    value: string;
};



// До цього обєкту ви матимете доступ з будь якого компоненту, для використання достаньо використати хук на useComputron()
// Приклад: const { state, compile, run, consoleOutput } = useComputron();
// PS я не до кінця впевнена що треба а що ні, тому якщо що треба буде розширювати
type ComputronContextType = {
    // поточний стан компутрона
    state: ComputronState | null;
    files: ProgramFile[];
    activeFile: ProgramFile | null;

    // Console -----------------------------------------
    // поле значень в консолі, при вводі тип інпут, з беку іде аутпут
    consoleOutput: ConsoleData[];
    // функція для очистки консолі, просто для зручності
    cleanConsole: () => void;
    // передати ввід з консолі
    consoleInput: (value: string) => void;
    // змінна яка визначає чи потрібен ввід в консоль
    inputRequested: InputType;
    compilationErrorLine: number|null;

    // Files -------------------------------------------
    // скомпілювати (опціонально ранити) актуальний файл
    compile: (code: string, run: boolean) => void;
    // наразі я погано розумію як нам працювати з файлами в плані відкрити, закрити
    // заготовка передбачає збереження файлів на фронті у вигляді масивів з данних і пасів, але це було б непогано додатково обговорити
    saveFile: () => Promise<void>;
    saveFileAs: () => Promise<void>;
    closeFile: (file:ProgramFile) => void;
    openFile:() => Promise<void>;
    newFile: (name:string) => Promise<void>;
    updateActiveFile: (value: string) => void;
    setActiveFile: (file: ProgramFile) => void;

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

    const firstFile: ProgramFile = {
        path: undefined,
        name: "Untitled.txt",
        content: ""
    }

    const [state, setState] = useState<ComputronState | null>(null);
    const [files, setFiles] = useState<ProgramFile[]>([firstFile]);
    const [activeFile, setActiveFile] = useState<ProgramFile | null>(firstFile);
    const [consoleOutput, setConsoleOutput] = useState<ConsoleData[]>([]);
    const [inputRequested, setInputRequested] = useState<InputType>(null);
    const [compilationErrorLine, setCompilationErrorLine] = useState<number|null>(null);

    const handleOpenFile = async () => {
        const filePath = await window.electronAPI.askOpenFilePath({
            filters: [
                { name: "Text file", extensions: ["txt"] },
                { name: "All Files", extensions: ["*"] },
            ],
        });

        if (!filePath) {
            console.error("Failed to open file");
            return;
        }

        const existingFile = files.find(f => f.path === filePath);
        if (existingFile) {
            setActiveFile(existingFile);
            return;
        }

        const result = await window.electronAPI.openFile(filePath);

        if (!result.success) {
            console.error(result.error);
            return;
        }

        const file = result.data;
        setFiles(prev => [...prev, file]);
        setActiveFile(file);
    };

    const handleSaveFile = async () => {
        if (activeFile) {
            if(activeFile.path === undefined) {
                await handleSaveAs();
            }
            else {
                await window.electronAPI.saveFile(
                    activeFile.path,
                    activeFile.content
                );
            }
        }
    };



    const handleSaveAs = async () => {
        if (activeFile) {
            const filePath = await window.electronAPI.askSavingPath({
                defaultPath: "Untitled.txt",
                filters: [
                    { name: "Text file", extensions: ["txt"] },
                    { name: "All Files", extensions: ["*"] },
                ],
            });

            if (!filePath) {
                console.error("Failed to save file");
                return;
            }

            const svingResult = await window.electronAPI.saveFile(filePath, activeFile.content);

            if (!svingResult.success) {
                console.error(svingResult.error);
                return;
            }

            // Store the old file's path/name to identify it
            const oldFilePath = activeFile.path;

            const openingResult = await window.electronAPI.openFile(filePath);

            if (!openingResult.success) {
                console.error(openingResult.error);
                return;
            }

            const newFile = openingResult.data;

            // Remove the old file using path comparison and add the new one
            setFiles(prevFiles => {
                const filteredFiles = prevFiles.filter(f =>
                    !(f.path === oldFilePath)
                );
                return [...filteredFiles, newFile];
            });

            setActiveFile(newFile);
        }
    };

    const handleNewFile = async (name:string) => {
        const newFile = {path:undefined, name:name, content:""}
        setFiles(prev => [...prev, newFile]);
        setActiveFile(newFile);
    }

    const handleCloseFile = (file: ProgramFile) => {
        setFiles(prevFiles => {
            const newFiles = prevFiles.filter(f => f !== file);
            if (newFiles.length === 0) {
                setActiveFile(null);
            } else if (activeFile === file) {
                setActiveFile(newFiles[0]);
            }
            return newFiles;
        });
    };

    const handleUpdateActiveFile = (value: string) => {
        if (!activeFile) return;
        setCompilationErrorLine(null)

        setFiles(prevFiles =>
            prevFiles.map(f =>
                f === activeFile ? { ...f, content: value } : f
            )
        );
        setActiveFile(prev => prev ? { ...prev, content: value } : null);
    };


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



    useEffect(() => {
        let alive = true;

        (async () => {
            const initial = await window.electronAPI.getInitialComputronState();
            if (alive) setState(initial);
            console.log(initial);
        })();

        return () => { alive = false; };
    }, []);




    const cleanConsole = () => setConsoleOutput([]);

    useEffect(() => {
        const unsubscribeUpdate = window.electronAPI.onComputronUpdate(handleComputronUpdate);
        const unsubscribeConsole = window.electronAPI.onConsoleOutput((value) => {
            setConsoleOutput(prev => [...prev, { type: 'out', value }]);
        });
        const unsubscribeInput = window.electronAPI.onRequestInput((type:InputType) => setInputRequested(type));
        const unsubscribeCompErr = window.electronAPI.onCompilationError((value) => {
            setConsoleOutput(prev => [...prev, { type: 'err', value: `Compilation error on line: ${value.line}\n ${value.error}` }]);
            setCompilationErrorLine(value.line);
        });
        const unsubscribeExecutionError = window.electronAPI.onExecutionError((value) => {
            setConsoleOutput(prev => [...prev, { type: 'err', value: `Execution error on PC: ${value.pc}\n ${value.error}`  }]);
        });

        return () => {
            unsubscribeUpdate();
            unsubscribeConsole();
            unsubscribeInput();
            unsubscribeCompErr();
            unsubscribeExecutionError();
        };
    }, []);

    const value: ComputronContextType = {
        state,
        files,
        activeFile,
        consoleOutput,
        inputRequested,
        compilationErrorLine,
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
        saveFile: handleSaveFile,
        saveFileAs: handleSaveAs,
        closeFile: handleCloseFile,
        openFile:handleOpenFile,
        newFile: handleNewFile,
        updateActiveFile: handleUpdateActiveFile,
        setActiveFile: setActiveFile,
    };

    return <ComputronContext.Provider value={value}>{children}</ComputronContext.Provider>;
};

export const useComputron = () => {
    const context = useContext(ComputronContext);
    if (!context) throw new Error("useComputron must be used within ComputronProvider");
    return context;
};
