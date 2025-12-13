type Register = 'pc' | 'sp' | 'a' | 'x' | 'rh' | 'rl'

type ComputronState = {
    pc: number;
    sp: number;
    a: number;
    x: number;
    rh: number;
    rl: number;
    memory: Array<number>;
}

type FileResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

interface Window {
    electronAPI: {
        compile(plaintextCode: string, runAfterCompilation: boolean): void;
        run(): void;
        setRegister(register: Register, value: number): void;
        setMemoryCell(value: number): void;
        consoleInput(value: number): void;
        selectFile(path: string): FileResult<string>;
        saveFile(newContent: string): FileResult<void>;
        loadRamFromFile(path: string): FileResult<void>;
        saveRamToFile(path: string): FileResult<void>;
        onComputronUpdate(cb: (state: ComputronState) => void): () => void;
        onConsoleOutput(cb: (value: string) => void): () => void;
        onRequestInput(cb: (value: number) => void): () => void;
    }
}