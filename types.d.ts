type Register = 'pc' | 'sp' | 'a' | 'x' | 'rh' | 'rl'

type FileSavingResult = 'success' | 'failure'

type ComputronState = {
    pc: number;
    sp: number;
    a: number;
    x: number;
    rh: number;
    rl: number;
    memory: Array<number>;
}

type SelectFileResult = {
    success: true;
    content: string;
} | {
    success: false;
}

interface Window {
    electronAPI: {
        compile(plaintextCode: string, runAfterCompilation: boolean): void;
        run(): void;
        setRegister(register: Register, value: number): void;
        setMemoryCell(value: number): void;
        consoleInput(value: number): void;
        selectFile(path: string): SelectFileResult;
        saveFile(newContent: string): FileSavingResult;
        onComputronUpdate(cb: (state: ComputronState) => void): () => void;
        onConsoleOutput(cb: (value: string) => void): () => void;
        onRequestInput(cb: (value: number) => void): () => void;
    }
}