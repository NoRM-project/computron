import { RequestHandler } from "../requestHandler.js";
import { CPU } from "./cpu.js";
import { instructionTable } from "./instructionTable.js";

const STEP_DELAY = 25;

export async function run (cpu: CPU) {
    const requestHandler = RequestHandler.getInstance();
    cpu.setRunning(true);

    while (cpu.getRunning()) {
        let oldPc = cpu.getPC();
        console.log(oldPc);
        const commandCode = cpu.getMemoryCell(oldPc);
        const handler = instructionTable[commandCode];

        if (!handler) {
            requestHandler.sendExecutionError(`Unknown opcode: ${commandCode}`, oldPc);
        }
        
        await handler(cpu); 
        requestHandler.sendComputronUpdate(cpu.getState());
        if (!cpu.getRunning()) break;

        if (oldPc == cpu.getPC()){
            requestHandler.sendExecutionError(`PC was not updated by opcode ${commandCode}`, oldPc);
        }

       await sleep(STEP_DELAY)
    }
}

export function stop (cpu: CPU) {
    cpu.setRunning(false);
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}