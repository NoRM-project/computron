type Register = 'pc' | 'sp' | 'a' | 'x' | 'rh' | 'rl'

type ComputronState = {
    pc: number;
    sp: number;
    a: number;
    x: number;
    rh: number;
    rl: number;
    running: boolean;
    memory: Array<number>;
}

type InputType = 'int' | 'char' | 'float' | null

type CompilationError = {
    error: string
    line: number
}

type ExecutionError = {
    error: string
    pc: number
}

type ProgramFile = {
    id: string
    path: string | undefined;
    name: string;
    content: string;
}

type FileResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

interface Window {
    electronAPI: {
        openFile(path: string): Promise<FileResult<ProgramFile>>;
        saveFile(path: string, newContent: string): Promise<FileResult<void>>;
        loadBinaryFile(path: string): Promise<FileResult<ArrayBuffer>>;
        saveBinaryFile(path: string, content: ArrayBuffer): Promise<FileResult<void>>;
        askOpenFilePath(options?: Electron.OpenDialogOptions): Promise<string | null>,
        askSavingPath(options?: Electron.SaveDialogOptions): Promise<string | null>,
    }
}