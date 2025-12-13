import { RequestHandler } from "../requestHandler.js";

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

    getState() : ComputronState {
        return this.state;
    }

    readRealFromMemory(addr: number): number {
        const uint32 = (this.state.rh << 16) | this.state.rl;
        const buf = new ArrayBuffer(4);
        const dv = new DataView(buf);
        dv.setUint32(0, uint32, true); // little-endian
        return dv.getFloat32(0, true);
    }
    
    writeRealToMemory(addr: number, val: number): void {
        const buf = new ArrayBuffer(4);
        const dv = new DataView(buf);
        dv.setFloat32(0, val, true);
        const uint32 = dv.getUint32(0, true);
        const rl = uint32 & 0xFFFF;
        const rh = (uint32 >>> 16) & 0xFFFF;
        this.state.memory[addr] = rl;
        this.state.memory[addr + 1] = rh;
    }
    
    getRAsFloat(): number {
        const uint32 = (this.state.rh << 16) | this.state.rl;
        const buf = new ArrayBuffer(4);
        const dv = new DataView(buf);
        dv.setUint32(0, uint32, true);
        return dv.getFloat32(0, true);
    }
    
    setRFromFloat(val: number): void {
        const buf = new ArrayBuffer(4);
        const dv = new DataView(buf);
        dv.setFloat32(0, val, true);
        const uint32 = dv.getUint32(0, true);
        const rl = uint32 & 0xFFFF;
        const rh = (uint32 >>> 16) & 0xFFFF;
        this.state.rl = rl;
        this.state.rh = rh;
    }

    setRegister(val: number, reg: Register) {
        this.state[reg] = val;
        const reqHandler = RequestHandler.getInstance();
        reqHandler.sendComputronUpdate(this.state);
    };

    setMemoryCell(val: number, index: number) {
        this.state.memory[index] = val;
        const reqHandler = RequestHandler.getInstance();
        reqHandler.sendComputronUpdate(this.state);
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