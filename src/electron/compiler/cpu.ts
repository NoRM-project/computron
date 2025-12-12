export class CPU {
    private static instance: CPU | null = null;
    private state: ComputronState = {
        pc: 0,
        sp: 0,
        a: 0,
        x: 0,
        rh: 0,
        rl: 0,
        memory: new Array<number>(),
    };
    private runningSignal: boolean = false;
    private newInput: string = "";

    private constructor() {}

    public static getInstance(): CPU {
        if (CPU.instance === null) {
            CPU.instance = new CPU();
        }
        return CPU.instance;
    }

    setRegister(val: number, reg: Register) {
        this.state[reg] = val;
    };

    setMemoryCell(val: number, index: number) {
        this.state.memory[index] = val;
    };

    addToPC(val: number) {
        this.state.pc =+ val;
    };

    setPC(val: number) {
        if (val < 0)
            return;
        this.state.pc = val;
    };

    setSP(val: number) {
        if (val < 0)
            return;
        this.state.sp = val;
    };

    setA(val: number) {
        this.state.a = val;
    };

    setRH(val: number) {
        this.state.rh = val;
    }; 

    setRL(val: number) {
        this.state.rl = val;
    }; 

    setX(val: number) {
        this.state.x = val;
    };

    setRunningSignal(val: boolean) {
        this.runningSignal = val
    }

    setMemory(val: Array<number>) {
        this.state.memory = val
    }

    getA() : number {
        return this.state.a;
    };

    getSP() : number {
        return this.state.sp;
    }

    getRH(): number {
        return this.state.rh;
    }

    getRL(): number {
        return this.state.rl;
    }

    getX(): number {
        return this.state.x;
    }

    getMemoryCell(index: number) : number {
        return this.state.memory[index];
    };

    getPC() : number {
        return this.state.pc;
    };

    getRunningSignal(): boolean {
        return this.runningSignal;
    }
}