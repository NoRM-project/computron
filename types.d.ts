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

type InputType = 'int' | 'char' | 'float' | null

type ProgramFile = {
    path: string | undefined;
    name: string;
    content: string;
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
        consoleInput(value: string): void;
        openFile(path: string): Promise<FileResult<ProgramFile>>;
        saveFile(path: string, newContent: string): Promise<FileResult<void>>;
        loadRamFromFile(path: string): Promise<FileResult<void>>;
        saveRamToFile(path: string): Promise<FileResult<void>>;
        getInitialComputronState(): Promise<ComputronState>;
        onComputronUpdate(cb: (state: ComputronState) => void): () => void;
        onConsoleOutput(cb: (value: string) => void): () => void;
        onRequestInput(cb: (type:InputType) => void): () => void;
        askOpenFilePath(options?: Electron.OpenDialogOptions): Promise<string | null>,
        askSavingPath(options?: Electron.SaveDialogOptions): Promise<string | null>,
    }
}