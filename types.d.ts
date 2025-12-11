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
        onConsoleOutput(cb: (value: number) => void): () => void;
        onRequestInput(cb: (value: number) => void): () => void;
    }
}

enum CommandDecimal {
    NOP = 0,
    BZE = 1,
    JMP = 2,
    JSR = 3,
    RTS = 4,
    EXIT = 5,
    INPC = 6,
    INP = 7,
    INPR = 8,
    OUTC = 9,
    OUT = 10,
    OUTR = 11,
    POP = 12,
    POPR = 13,
    PUSH = 14,
    PUSHR = 15,
    LDA = 16,
    LDAM = 17,
    LDAI = 18,
    LDAX = 19,
    LDR = 20,
    LDRI = 21,
    STA = 22,
    STAI = 23,
    STAR = 24,
    LDX = 25,
    STX = 26,
    LDS = 27,
    STS = 28,
    OR = 29,
    AND = 30,
    NOT = 31,
    EQ = 32,
    NE = 33,
    LT = 34,
    LE = 35,
    GT = 36,
    GE = 37,
    EQR = 38,
    NER = 39,
    LTR = 40,
    LER = 41,
    GTR = 42,
    GER = 43,
    ADD = 44,
    ADDM = 45,
    SUB = 46,
    SUBM = 47,
    MUL = 48,
    DIV = 49,
    NEG = 50,
    ADDR = 51,
    SUBR = 52,
    MULR = 53,
    DIVR = 54,
    NEGR = 55
}