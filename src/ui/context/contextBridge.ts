let onConsoleOutput: ((value: string) => void) | null = null;
let onExecutionError: ((value: ExecutionError) => void) | null = null;
let onCompilationError: ((value: CompilationError) => void) | null = null;
let onRequestInput: ((type: InputType) => Promise<string>) | null = null;
let onComputronUpdate: ((state: ComputronState) => void) | null = null;

export function registerConsoleHandlers(handlers: {
    onConsoleOutput: (val: string) => void;
    onExecutionError: (value: ExecutionError) => void;
    onCompilationError: (value: CompilationError) => void;
    onRequestInput: (type: InputType) => Promise<string>;
    onComputronUpdate: (state: ComputronState) => void;
}) {
    onConsoleOutput = handlers.onConsoleOutput;
    onExecutionError = handlers.onExecutionError;
    onCompilationError = handlers.onCompilationError;
    onRequestInput = handlers.onRequestInput;
    onComputronUpdate = handlers.onComputronUpdate;
}

export function sendComputronUpdate(state: ComputronState) {
    onComputronUpdate?.({
        pc: state.pc,
        sp: state.sp,
        a: state.a,
        x: state.x,
        rh: state.rh,
        rl: state.rl,
        running: state.running,
        memory: [...state.memory],
    });
}

export function sendConsoleOutput(val: string) {
    onConsoleOutput?.(val);
}

export function sendExecutionError(error: string, pc: number) {
    onExecutionError?.({error, pc});
}

export function sendCompilationError(error: string, line: number) {
    onCompilationError?.({error, line});
}

export function requestConsoleInput(type: InputType): Promise<string>  {
    if (!onRequestInput) {
        return Promise.reject(new Error("No console input handler registered"));
    }
    return onRequestInput(type);
}
