import { CPU } from "./cpu.js";
import { instructionTable } from "./instructionTable.js";

export default function run(cpu: CPU) {
    let isProgRunning: boolean = true;
    while(isProgRunning) {
        const pc = cpu.getPC()
        const commandCode = cpu.getMemoryCell(pc)
        const handler = instructionTable[commandCode];
        if (!handler) {
            throw new Error(`Unknown opcode: ${commandCode} at PC=${pc}`);
        }

        handler(cpu); 
    }
}