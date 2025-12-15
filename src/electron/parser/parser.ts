import { CPU } from "../compiler/cpu.js";
import { RequestHandler } from "../requestHandler.js";
import { opcodeMap } from "./codeMap.js";

export function parseProgram(input: string, cpu: CPU): boolean {
    const tokens = input
        .split("\n")
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);

    const memory: Array<number> = new Array<number>();

    let i = 0;
    for (const token of tokens) {
        // if token is numeric → just push number
        i = i + 1;
        if (!isNaN(Number(token))) {
            memory.push(Number(token));
            continue;
        }

        // otherwise → treat as instruction mnemonic
        const opcode = opcodeMap[token.toLowerCase()];
        if (opcode === undefined) {
            const requestHandler = RequestHandler.getInstance();
            console.log(i)
            requestHandler.sendCompilationError(`Unknown instruction: ${token}`, i);
            return false;
        }

        memory.push(opcode);
    }

    cpu.setMemory(memory);
    const requestHandler = RequestHandler.getInstance();
    requestHandler.sendComputronUpdate(cpu.getState());
    return true;
}
