import { CPU } from "../compiler/cpu.js";
import { opcodeMap } from "./codeMap.js";

export function parseProgram(input: string, cpu: CPU) {
    const tokens = input
        .split(",")
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);

    const memory: Array<number> = new Array<number>();

    for (const token of tokens) {
        // if token is numeric → just push number
        if (!isNaN(Number(token))) {
            memory.push(Number(token));
            continue;
        }

        // otherwise → treat as instruction mnemonic
        const opcode = opcodeMap[token.toLowerCase()];
        if (opcode === undefined) {
            throw new Error(`Unknown instruction: ${token}`);
        }

        memory.push(opcode);
    }

    return memory;
}
