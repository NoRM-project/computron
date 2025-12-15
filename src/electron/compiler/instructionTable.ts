import { CPU } from "./cpu.js";
import { RequestHandler } from "../requestHandler.js";
import { CommandDecimal } from "./commandEnum.js";

type InstructionHandler = (cpu: CPU) => void | Promise<void>;

export const instructionTable: InstructionHandler[] = [];

function toInt16(n: number): number {
    return (n << 16) >> 16;
}

// 0: NOP
instructionTable[CommandDecimal.NOP] = (cpu) => {
    cpu.addToPC(1);
};

// 1: BZE
instructionTable[CommandDecimal.BZE] = (cpu) => {
    if (cpu.getA() === 0) {
        const addr = cpu.getPC() + 1;
        cpu.setPC(cpu.getMemoryCell(addr));
    } else {
        cpu.addToPC(2);
    }
};

// 2: JMP
instructionTable[CommandDecimal.JMP] = (cpu) => {
    const addr = cpu.getPC() + 1;
    cpu.setPC(cpu.getMemoryCell(addr));
};

// 3: JSR  M[SP] := PC + 2; SP := SP + 1; PC := adr;
instructionTable[CommandDecimal.JSR] = (cpu) => {
    const sp = cpu.getSP();
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.setMemoryCell(pc + 2, sp);
    cpu.setSP(sp + 1);
    cpu.setPC(adr);
};

// 4: RTS  SP := SP – 1; PC := M[SP];
instructionTable[CommandDecimal.RTS] = (cpu) => {
    let sp = cpu.getSP();
    sp = sp - 1;
    cpu.setSP(sp);
    const ret = cpu.getMemoryCell(sp);
    cpu.setPC(ret);
};

// 5: EXIT
instructionTable[CommandDecimal.EXIT] = (cpu) => {
    cpu.setRunningSignal(false);
};

// 6: INPC A := typed_character_ascii_code(); PC := PC + 1;
instructionTable[CommandDecimal.INPC] = async (cpu) => {
    const reqHandler = RequestHandler.getInstance();
    const inp: string = await reqHandler.requestInputFromFrontend('char');
    const val: number = inp.charCodeAt(0);
    cpu.setA(val);
    cpu.addToPC(1);
    
};

// 7: INP A := typed_integer_value(); PC := PC + 1;
instructionTable[CommandDecimal.INP] = async (cpu) => {
    const reqHandler = RequestHandler.getInstance();
    const inp: string = await reqHandler.requestInputFromFrontend('char');
    const val: number = parseInt(inp);
    cpu.setA(val);
    cpu.addToPC(1);
};

// 8: INPR R := typed_floating_point_value(); PC := PC + 1;
instructionTable[CommandDecimal.INPR] = async (cpu) => {
    const reqHandler = RequestHandler.getInstance();
    const inp: string = await reqHandler.requestInputFromFrontend('float');
    // Expect inp to be a floating-point number (JS number)
    const val = parseFloat(inp);
    cpu.setRFromFloat(val);
    cpu.addToPC(1);
};

// 9: OUTC display_character_of_code_in (A); PC := PC + 1;
instructionTable[CommandDecimal.OUTC] = (cpu) => {
    const requestHandler = RequestHandler.getInstance();
    const a: number = cpu.getA();
    const out: string = String.fromCharCode(a & 0xFF);
    requestHandler.sendOutputToFrontend(out);
    cpu.addToPC(1);
};

// 10: OUT display_integer_value_in (A); PC := PC + 1;
instructionTable[CommandDecimal.OUT] = (cpu) => {
    const requestHandler = RequestHandler.getInstance();
    const a: number = toInt16(cpu.getA());
    requestHandler.sendOutputToFrontend(a.toString());
    cpu.addToPC(1);
};

// 11: OUTR display_floating_point_value_in (R); PC := PC + 1;
instructionTable[CommandDecimal.OUTR] = (cpu) => {
    const requestHandler = RequestHandler.getInstance();
    const val = cpu.getRAsFloat();
    requestHandler.sendOutputToFrontend(String(val));
    cpu.addToPC(1);
};

// 12: POP SP := SP – 1; A := M[SP]; PC := PC + 1;
instructionTable[CommandDecimal.POP] = (cpu) => {
    let sp = cpu.getSP();
    sp = sp - 1;
    const memorySP = cpu.getMemoryCell(sp);
    cpu.setA(memorySP);
    cpu.setSP(sp);
    cpu.addToPC(1);
};

// 13: POPR SP := SP – 2; R := (M[SP], M[SP + 1]); PC := PC + 1;
instructionTable[CommandDecimal.POPR] = (cpu) => {
    let sp = cpu.getSP();
    sp = sp - 2;
    cpu.readRealFromMemory(sp);
    cpu.setSP(sp);
    cpu.addToPC(1);
};

// 14: PUSH M[SP] := A; SP := SP + 1; PC := PC + 1;
instructionTable[CommandDecimal.PUSH] = (cpu) => {
    const sp = cpu.getSP();
    const a = cpu.getA();
    cpu.setMemoryCell(a, sp);
    cpu.setSP(sp + 1);
    cpu.addToPC(1);
};

// 15: PUSHR (M[SP], M[SP + 1]) := R; SP := SP + 2; PC := PC + 1;
instructionTable[CommandDecimal.PUSHR] = (cpu) => {
    const sp = cpu.getSP();
    const rh = cpu.getRH();
    const rl = cpu.getRL();
    cpu.setMemoryCell(rl, sp);
    cpu.setMemoryCell(rh, sp + 1);
    cpu.setSP(sp + 2);
    cpu.addToPC(1);
};

// 16: LDA adr A := M[adr]; PC := PC + 2;
instructionTable[CommandDecimal.LDA] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const val = cpu.getMemoryCell(adr);
    cpu.setA(val);
    cpu.addToPC(2);
};

// 17: LDAM (immediate) A := val; PC := PC + 2;
instructionTable[CommandDecimal.LDAM] = (cpu) => {
    const pc = cpu.getPC();
    const val = cpu.getMemoryCell(pc + 1);
    cpu.setA(val);
    cpu.addToPC(2);
};

// 18: LDAI (indirect) A := M[M[adr]]; PC := PC + 2;
instructionTable[CommandDecimal.LDAI] = (cpu) => {
    const pc = cpu.getPC();
    const adr1 = cpu.getMemoryCell(pc + 1);
    const adr2 = cpu.getMemoryCell(adr1);
    const val = cpu.getMemoryCell(adr2);
    cpu.setA(val);
    cpu.addToPC(2);
};

// 19: LDAX (indexed) A := M[val + X]; PC := PC + 2;
instructionTable[CommandDecimal.LDAX] = (cpu) => {
    const pc = cpu.getPC();
    const val = cpu.getMemoryCell(pc + 1);
    const x = cpu.getX();
    const adr = val + x;
    const mem = cpu.getMemoryCell(adr);
    cpu.setA(mem);
    cpu.addToPC(2);
};

// 20: LDR adr R := (M[adr], M[adr + 1]); PC := PC + 2;
instructionTable[CommandDecimal.LDR] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.readRealFromMemory(adr);
    cpu.addToPC(2);
};

// 21: LDRI (indirect) R := (M[M[adr]], M[M[adr] + 1]); PC := PC + 2;
instructionTable[CommandDecimal.LDRI] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const addrIndirect = cpu.getMemoryCell(adr);
    cpu.readRealFromMemory(addrIndirect);
    cpu.addToPC(2);
};

// 22: STA adr M[adr] := A; PC := PC + 2;
instructionTable[CommandDecimal.STA] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.setMemoryCell(cpu.getA(), adr);
    cpu.addToPC(2);
};

// 23: STAI (indirect) M[M[adr]] := A; PC := PC + 2;
instructionTable[CommandDecimal.STAI] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const target = cpu.getMemoryCell(adr);
    cpu.setMemoryCell(cpu.getA(), target);
    cpu.addToPC(2);
};

// 24: STAR (STR'I) (indirect store R): (M[M[adr]], M[M[adr] + 1]) := R; PC := PC + 2;
instructionTable[CommandDecimal.STAR] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const target = cpu.getMemoryCell(adr);
    cpu.writeRealToMemory(target, cpu.getRAsFloat());
    cpu.addToPC(2);
};

// 25: LDX adr X := M[adr]; PC := PC + 2;
instructionTable[CommandDecimal.LDX] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.setX(cpu.getMemoryCell(adr));
    cpu.addToPC(2);
};

// 26: STX adr M[adr] := X; PC := PC + 2;
instructionTable[CommandDecimal.STX] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.setMemoryCell(cpu.getX(), adr);
    cpu.addToPC(2);
};

// 27: LDS adr SP := M[adr]; PC := PC + 2;
instructionTable[CommandDecimal.LDS] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.setSP(cpu.getMemoryCell(adr));
    cpu.addToPC(2);
};

// 28: STS adr M[adr] := SP; PC := PC + 2;
instructionTable[CommandDecimal.STS] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.setMemoryCell(cpu.getSP(), adr);
    cpu.addToPC(2);
};

// 29: OR adr if ((A = 0) && (M[adr] = 0)) then A := 0 else A := 1; PC := PC + 2;
instructionTable[CommandDecimal.OR] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const m = cpu.getMemoryCell(adr);
    cpu.setA((cpu.getA() === 0 && m === 0) ? 0 : 1);
    cpu.addToPC(2);
};

// 30: AND adr if ((A = 1) && (M[adr] = 1)) then A := 1 else A := 0; PC := PC + 2;
instructionTable[CommandDecimal.AND] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const m = cpu.getMemoryCell(adr);
    cpu.setA((cpu.getA() === 1 && m === 1) ? 1 : 0);
    cpu.addToPC(2);
};

// 31: NOT if (A = 1) then A := 0 else A := 1; PC := PC + 1;
instructionTable[CommandDecimal.NOT] = (cpu) => {
    cpu.setA(cpu.getA() === 1 ? 0 : 1);
    cpu.addToPC(1);
};

// 32: EQ adr if (A = M[adr]) then A := 1 else A := 0; PC := PC + 2;
instructionTable[CommandDecimal.EQ] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.setA(cpu.getA() === cpu.getMemoryCell(adr) ? 1 : 0);
    cpu.addToPC(2);
};

// 33: NE adr
instructionTable[CommandDecimal.NE] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.setA(cpu.getA() !== cpu.getMemoryCell(adr) ? 1 : 0);
    cpu.addToPC(2);
};

// 34: LT adr if (int(A) < int(M[adr])) then A := 1 else 0;
instructionTable[CommandDecimal.LT] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.setA(toInt16(cpu.getA()) < toInt16(cpu.getMemoryCell(adr)) ? 1 : 0);
    cpu.addToPC(2);
};

// 35: LE adr
instructionTable[CommandDecimal.LE] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.setA(toInt16(cpu.getA()) <= toInt16(cpu.getMemoryCell(adr)) ? 1 : 0);
    cpu.addToPC(2);
};

// 36: GT adr
instructionTable[CommandDecimal.GT] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.setA(toInt16(cpu.getA()) > toInt16(cpu.getMemoryCell(adr)) ? 1 : 0);
    cpu.addToPC(2);
};

// 37: GE adr
instructionTable[CommandDecimal.GE] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    cpu.setA(toInt16(cpu.getA()) >= toInt16(cpu.getMemoryCell(adr)) ? 1 : 0);
    cpu.addToPC(2);
};

// 38: EQR adr if (R == (M[adr],M[adr+1])) then A := 1 else 0;
instructionTable[CommandDecimal.EQR] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const rl = cpu.getMemoryCell(adr);
    const rh = cpu.getMemoryCell(adr + 1);
    const equal = (cpu.getRL() === rl) && (cpu.getRH() === rh);
    cpu.setA(equal ? 1 : 0);
    cpu.addToPC(2);
};

// 39: NER adr
instructionTable[CommandDecimal.NER] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const rl = cpu.getMemoryCell(adr);
    const rh = cpu.getMemoryCell(adr + 1);
    const notEqual = (cpu.getRL() !== rl) || (cpu.getRH() !== rh);
    cpu.setA(notEqual ? 1 : 0);
    cpu.addToPC(2);
};

// 40: LTR adr (R < memory real)
instructionTable[CommandDecimal.LTR] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const memReal = cpu.readRealFromMemory(adr);
    const rVal = cpu.getRAsFloat();
    cpu.setA(rVal < memReal ? 1 : 0);
    cpu.addToPC(2);
};

// 41: LER adr
instructionTable[CommandDecimal.LER] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const memReal = cpu.readRealFromMemory(adr);
    const rVal = cpu.getRAsFloat();
    cpu.setA(rVal <= memReal ? 1 : 0);
    cpu.addToPC(2);
};

// 42: GTR adr
instructionTable[CommandDecimal.GTR] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const memReal = cpu.readRealFromMemory(adr);
    const rVal = cpu.getRAsFloat();
    cpu.setA(rVal > memReal ? 1 : 0);
    cpu.addToPC(2);
};

// 43: GER adr
instructionTable[CommandDecimal.GER] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const memReal = cpu.readRealFromMemory(adr);
    const rVal = cpu.getRAsFloat();
    cpu.setA(rVal >= memReal ? 1 : 0);
    cpu.addToPC(2);
};

// 44: ADD adr A = int(A) + int(M[adr]); PC := PC + 2;
instructionTable[CommandDecimal.ADD] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const res = toInt16(cpu.getA()) + toInt16(cpu.getMemoryCell(adr));
    cpu.setA(res);
    cpu.addToPC(2);
};

// 45: ADDM immediate val
instructionTable[CommandDecimal.ADDM] = (cpu) => {
    const pc = cpu.getPC();
    const val = cpu.getMemoryCell(pc + 1);
    const res = toInt16(cpu.getA()) + toInt16(val);
    cpu.setA(res);
    cpu.addToPC(2);
};

// 46: SUB adr
instructionTable[CommandDecimal.SUB] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const res = toInt16(cpu.getA()) - toInt16(cpu.getMemoryCell(adr));
    cpu.setA(res);
    cpu.addToPC(2);
};

// 47: SUBM immediate
instructionTable[CommandDecimal.SUBM] = (cpu) => {
    const pc = cpu.getPC();
    const val = cpu.getMemoryCell(pc + 1);
    const res = toInt16(cpu.getA()) - toInt16(val);
    cpu.setA(res);
    cpu.addToPC(2);
};

// 48: MUL adr
instructionTable[CommandDecimal.MUL] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const res = toInt16(cpu.getA()) * toInt16(cpu.getMemoryCell(adr));
    cpu.setA(res);
    cpu.addToPC(2);
};

// 49: DIV adr (integer division)
instructionTable[CommandDecimal.DIV] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const divisor = toInt16(cpu.getMemoryCell(adr));
    if (divisor === 0) {
        const requestHandler = RequestHandler.getInstance();
        requestHandler.sendCompilationError("Division by zero", pc);
    }
    const res = Math.trunc(toInt16(cpu.getA()) / divisor);
    cpu.setA(res);
    cpu.addToPC(2);
};

// 50: NEG A := - int (A); PC := PC + 1;
instructionTable[CommandDecimal.NEG] = (cpu) => {
    cpu.setA(-toInt16(cpu.getA()));
    cpu.addToPC(1);
};

// 51: ADDR adr R := R + (M[adr], M[adr + 1]); PC := PC + 2;
instructionTable[CommandDecimal.ADDR] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const memReal = cpu.readRealFromMemory(adr);
    const rVal = cpu.getRAsFloat();
    cpu.setRFromFloat(rVal + memReal);
    cpu.addToPC(2);
};

// 52: SUBR adr R := R - memReal
instructionTable[CommandDecimal.SUBR] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const memReal = cpu.readRealFromMemory(adr);
    const rVal = cpu.getRAsFloat();
    cpu.setRFromFloat(rVal - memReal);
    cpu.addToPC(2);
};

// 53: MULR adr R := R * memReal
instructionTable[CommandDecimal.MULR] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const memReal = cpu.readRealFromMemory(adr);
    const rVal = cpu.getRAsFloat();
    cpu.setRFromFloat(rVal * memReal);
    cpu.addToPC(2);
};

// 54: DIVR adr R := R / memReal
instructionTable[CommandDecimal.DIVR] = (cpu) => {
    const pc = cpu.getPC();
    const adr = cpu.getMemoryCell(pc + 1);
    const memReal = cpu.readRealFromMemory(adr);
    if (memReal === 0) {
        const requestHandler = RequestHandler.getInstance();
        requestHandler.sendCompilationError("Real division by zero", pc);
    }
    const rVal = cpu.getRAsFloat();
    cpu.setRFromFloat(rVal / memReal);
    cpu.addToPC(2);
};

// 55: NEGR R := - R; PC := PC + 1;
instructionTable[CommandDecimal.NEGR] = (cpu) => {
    const rVal = cpu.getRAsFloat();
    cpu.setRFromFloat(-rVal);
    cpu.addToPC(1);
};