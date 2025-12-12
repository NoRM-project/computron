import { RequestHandler } from "../requestHandler.js";
import { CPU } from "./cpu.js";
import { instructionTable } from "./instructionTable.js";

export default function run(cpu: CPU) {
    let isProgRunning: boolean = true;
    for (let i = 0; i < Number.MAX_VALUE; i++) {
        const pc = cpu.getPC()
        const commandCode = cpu.getMemoryCell(pc)
        const handler = instructionTable[commandCode];
        if (!handler) {
            throw new Error(`Unknown opcode: ${commandCode} at PC=${pc}`);
        }

        handler(cpu); 
    }
    const requestHandler = RequestHandler.getInstance();
    requestHandler.sendComputronUpdate(cpu.getState());
}