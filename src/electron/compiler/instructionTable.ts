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
    const pc = cpu.getPC();
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
};

instructionTable[CommandDecimal.POPR] = (cpu) => {
    
};


instructionTable[CommandDecimal.PUSH] = (cpu) => {
    
};


instructionTable[CommandDecimal.PUSHR] = (cpu) => {
    
};


instructionTable[CommandDecimal.LDA] = (cpu) => {
    
};


instructionTable[CommandDecimal.LDAM] = (cpu) => {
    
};


instructionTable[CommandDecimal.LDAI] = (cpu) => {
    
};


instructionTable[CommandDecimal.LDAX] = (cpu) => {
    
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