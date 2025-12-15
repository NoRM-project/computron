import { RequestHandler } from "../requestHandler.js";
import {loadBinaryFile, saveBinaryFile} from "../services/fileService.js";

const MAX_INT = 65536;

export class CPU {
    private static instance: CPU | null = null;
    private state: ComputronState = {
        pc: 0,
        sp: 0,
        a: 0,
        x: 0,
        rh: 0,
        rl: 0,
        memory: new Array<number>(65536).fill(0),
        running:  false
    };

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
        if (this.state.pc + val >= MAX_INT) {
            this.state.running = false;
            return;
        }
        this.state.pc += val;
    };

    setPC(val: number) {
        if (val >= MAX_INT || val < 0) {
            this.state.running = false;
            return;
        }
        if (val < 0){
            return;
        }
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

    setRunning(val: boolean) {
        this.state.running = val
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
        const val = this.state.memory[index]
        return val === undefined ? 0 : val;
    };

    getPC() : number {
        return this.state.pc;
    };

    getRunning(): boolean {
        return this.state.running;
    };

    loadRamFromFile(path: string): FileResult<void> {
        const result = loadBinaryFile(path);
        if (!result.success) return result;

        const buffer = result.data;

        if (buffer.byteLength % 2 !== 0) {
            return { success: false, error: "Invalid RAM file size" };
        }

        const view = new DataView(
            buffer.buffer,
            buffer.byteOffset,
            buffer.byteLength
        );

        const mem: number[] = [];

        for (let i = 0; i < buffer.byteLength; i += 2) {
            mem.push(view.getUint16(i, true));
        }

        this.state.memory = mem;

        const reqHandler = RequestHandler.getInstance();
        reqHandler.sendComputronUpdate(this.state);

        return { success: true, data: undefined };
    }

    saveRamToFile(path: string): FileResult<void> {
        const mem = this.state.memory;

        const buffer = new ArrayBuffer(mem.length * 2);
        const view = new DataView(buffer);

        for (let i = 0; i < mem.length; i++) {
            view.setUint16(i * 2, mem[i] & 0xffff, true);
        }

        return saveBinaryFile(path, Buffer.from(buffer));
    }
}