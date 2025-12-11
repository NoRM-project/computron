import { ipcMain, ipcRenderer } from "electron";
import { CPU } from "./cpu.js";
import { RequestHandler } from "../requestHandler.js";

type InstructionHandler = (cpu: CPU) => void;

export const instructionTable: InstructionHandler[] = [];

instructionTable[CommandDecimal.NOP] = (cpu) => {
    cpu.addToPC(1);
};

instructionTable[CommandDecimal.BZE] = (cpu) => {
    if (cpu.getA() === 0) {
        const addr = cpu.getPC() + 1;
        cpu.setPC(cpu.getMemoryCell(addr));
    } else {
        cpu.addToPC(2);
    }
};

instructionTable[CommandDecimal.JMP] = (cpu) => {
    const addr = cpu.getPC() + 1;
    cpu.setPC(cpu.getMemoryCell(addr));
};

instructionTable[CommandDecimal.JSR] = (cpu) => {
    const sp = cpu.getSP();
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc+1)
    cpu.setMemoryCell(pc + 2, sp);
    cpu.setSP(sp + 1);
    cpu.setPC(adr);
};

instructionTable[CommandDecimal.RTS] = (cpu) => {
    const sp = cpu.getSP();
    cpu.setSP(sp-1);
    cpu.setPC(cpu.getMemoryCell(sp))
};

instructionTable[CommandDecimal.EXIT] = (cpu) => {
    cpu.setRunningSignal(false);
};

instructionTable[CommandDecimal.INPC] = async (cpu) => {
    const reqHandler = RequestHandler.getInstance();
    cpu.setA(await reqHandler.requestInputFromFrontend())
};

instructionTable[CommandDecimal.INP] = async (cpu) => {
    const reqHandler = RequestHandler.getInstance();
    const inp = await reqHandler.requestInputFromFrontend() - 48;
    cpu.setA(inp)
};

instructionTable[CommandDecimal.INPR] = async (cpu) => {
    const reqHandler = RequestHandler.getInstance();
    const inp = await reqHandler.requestInputFromFrontend();
    const rh = Math.floor(inp);
    const rl = inp - rh;

    cpu.setRH(rh);
    cpu.setRH(rl);
};

instructionTable[CommandDecimal.OUTC] = (cpu) => {
    
};

instructionTable[CommandDecimal.OUT] = (cpu) => {
    
};

instructionTable[CommandDecimal.OUTR] = (cpu) => {
    
};

instructionTable[CommandDecimal.POP] = (cpu) => {
    const sp = cpu.getSP() - 1;
    const memorySP = cpu.getMemoryCell(sp)
    cpu.setA(memorySP);
    cpu.setSP(sp);
    cpu.addToPC(1);
};

instructionTable[CommandDecimal.POPR] = (cpu) => {
    const sp = cpu.getSP() - 2;
    const memorySPL = cpu.getMemoryCell(sp+1)
    const memorySPH = cpu.getMemoryCell(sp)
    cpu.setRH(memorySPH);
    cpu.setRL(memorySPL);
    cpu.setSP(sp);
    cpu.addToPC(1);
};


instructionTable[CommandDecimal.PUSH] = (cpu) => {
    const sp = cpu.getSP();
    const a = cpu.getA();
    cpu.setMemoryCell(a, sp);
    cpu.setSP(sp+1);
    cpu.addToPC(1);
};


instructionTable[CommandDecimal.PUSHR] = (cpu) => {
    const sp = cpu.getSP();
    const rh = cpu.getRH();
    const rl = cpu.getRL();
    cpu.setMemoryCell(sp, rh);
    cpu.setMemoryCell(sp + 1, rl);
    cpu.setSP(sp+2);
    cpu.addToPC(1);
};


instructionTable[CommandDecimal.LDA] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc+1);
    const val = cpu.getMemoryCell(adr);
    cpu.setA(val);
    cpu.addToPC(2);
};


instructionTable[CommandDecimal.LDAM] = (cpu) => {
    const pc = cpu.getPC();
    const val = cpu.getMemoryCell(pc+1);
    cpu.setA(val);
    cpu.addToPC(2);
};


instructionTable[CommandDecimal.LDAI] = (cpu) => {
    const pc = cpu.getPC();
    const adr1 = cpu.getMemoryCell(pc+1);
    const adr2 = cpu.getMemoryCell(adr1);
    const val = cpu.getMemoryCell(adr2);
    cpu.setA(val);
    cpu.addToPC(2);
};


instructionTable[CommandDecimal.LDAX] = (cpu) => {
    const pc = cpu.getPC();
    const x = cpu.getX();
    const val = cpu.getMemoryCell(pc+1);
    cpu.setA(val);
    cpu.addToPC(2);
};


instructionTable[CommandDecimal.LDR] = (cpu) => {
    
};


instructionTable[CommandDecimal.LDRI] = (cpu) => {
    
};


instructionTable[CommandDecimal.STA] = (cpu) => {
    
};


instructionTable[CommandDecimal.STAI] = (cpu) => {
    
};


instructionTable[CommandDecimal.STAR] = (cpu) => {
    
};


instructionTable[CommandDecimal.LDX] = (cpu) => {
    
};


instructionTable[CommandDecimal.STX] = (cpu) => {
    
};


instructionTable[CommandDecimal.LDS] = (cpu) => {
    
};


instructionTable[CommandDecimal.STS] = (cpu) => {
    
};


instructionTable[CommandDecimal.OR] = (cpu) => {
    
};


instructionTable[CommandDecimal.AND] = (cpu) => {
    
};


instructionTable[CommandDecimal.NOT] = (cpu) => {
    
};


instructionTable[CommandDecimal.EQ] = (cpu) => {
    
};


instructionTable[CommandDecimal.NE] = (cpu) => {
    
};


instructionTable[CommandDecimal.LT] = (cpu) => {
    
};


instructionTable[CommandDecimal.LE] = (cpu) => {
    
};


instructionTable[CommandDecimal.GT] = (cpu) => {
    
};


instructionTable[CommandDecimal.GE] = (cpu) => {
    
};


instructionTable[CommandDecimal.EQR] = (cpu) => {
    
};


instructionTable[CommandDecimal.NER] = (cpu) => {
    
};


instructionTable[CommandDecimal.LTR] = (cpu) => {
    
};


instructionTable[CommandDecimal.LER] = (cpu) => {
    
};


instructionTable[CommandDecimal.GTR] = (cpu) => {
    
};


instructionTable[CommandDecimal.GER] = (cpu) => {
    
};


instructionTable[CommandDecimal.ADD] = (cpu) => {
    
};


instructionTable[CommandDecimal.ADDM] = (cpu) => {
    
};


instructionTable[CommandDecimal.SUB] = (cpu) => {
    
};


instructionTable[CommandDecimal.SUBM] = (cpu) => {
    
};


instructionTable[CommandDecimal.MUL] = (cpu) => {
    
};


instructionTable[CommandDecimal.DIV] = (cpu) => {
    
};


instructionTable[CommandDecimal.NEG] = (cpu) => {
    
};


instructionTable[CommandDecimal.ADDR] = (cpu) => {
    
};


instructionTable[CommandDecimal.SUBR] = (cpu) => {
    
};


instructionTable[CommandDecimal.MULR] = (cpu) => {
    
};


instructionTable[CommandDecimal.DIVR] = (cpu) => {
    
};


instructionTable[CommandDecimal.NEGR] = (cpu) => {
    
};