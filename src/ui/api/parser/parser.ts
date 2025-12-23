import { CPU } from "../compiler/cpu.ts";
import { opcodeMap } from "./codeMap.ts";
import {sendCompilationError, sendComputronUpdate} from "../../context/contextBridge.ts";

export function parseProgram(input: string, cpu: CPU): boolean {
    const tokens = input
        .split("\n")
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);

    const mem = cpu.getMemoryReference();

    mem.fill(0);

    let addr = 0;
    let line = 0;

    for (const token of tokens) {
        line++;

        if (!isNaN(Number(token))) {
            mem[addr++] = Number(token);
            continue;
        }

        const opcode = opcodeMap[token];
        if (opcode === undefined) {
            sendCompilationError(`Unknown instruction: ${token}`, line);
            return false;
        }

        mem[addr++] = opcode;
    }

    sendComputronUpdate(cpu.getState());
    return true;
}
