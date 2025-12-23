import { CPU } from "./cpu.ts";
import { instructionTable } from "./instructionTable.ts";
import {sendComputronUpdate, sendConsoleOutput, sendExecutionError} from "../../context/contextBridge.ts";

const STEP_DELAY = 10;

export async function run (cpu: CPU) {
    cpu.setRunning(true);
    sendComputronUpdate(cpu.getState());

    sendConsoleOutput("Program started")

    while (cpu.getRunning()) {
        let oldPc = cpu.getPC();
        console.log(oldPc);
        const commandCode = cpu.getMemoryCell(oldPc);
        const handler = instructionTable[commandCode];

        if (!handler) {
            cpu.setRunning(false);
            sendExecutionError(`Unknown opcode: ${commandCode}`, oldPc);
            sendComputronUpdate(cpu.getState());
            return;
        }
        
        await handler(cpu);
        sendComputronUpdate(cpu.getState());
        if (!cpu.getRunning()) break;

        if (oldPc == cpu.getPC()){
            cpu.setRunning(false);
            sendExecutionError(`PC was not updated by opcode ${commandCode}`, oldPc);
            sendComputronUpdate(cpu.getState());
            return;
        }

       await sleep(STEP_DELAY)
    }
}

export function stop (cpu: CPU) {
    cpu.setRunning(false);
    sendComputronUpdate(cpu.getState());
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}