import { RequestHandler } from "../requestHandler.js";
import { CPU } from "./cpu.js";
import { instructionTable } from "./instructionTable.js";

const STEP_DELAY = 50;

export default async function run (cpu: CPU) {
    const requestHandler = RequestHandler.getInstance();
    cpu.setRunningSignal(true);
    while (cpu.getRunningSignal()) {
        let oldPc = cpu.getPC();
        console.log(oldPc);
        const commandCode = cpu.getMemoryCell(oldPc);
        const handler = instructionTable[commandCode];

        if (!handler) {
            requestHandler.sendExecutionError(`Unknown opcode: ${commandCode}`, oldPc);
        }
        
        await handler(cpu); 
        if (!cpu.getRunningSignal()) break;
        requestHandler.sendComputronUpdate(cpu.getState());

        if (oldPc == cpu.getPC()){
            requestHandler.sendExecutionError(`PC was not updated by opcode ${commandCode}`, oldPc);
        }

       await sleep(STEP_DELAY)
    }
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}