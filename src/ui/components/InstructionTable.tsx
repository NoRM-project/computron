import InstructionTableRow from "./InstructionTableRow";
import type { Instruction } from "./Helper";

type Props = {
    instructions: Instruction[];
};

const InstructionTable = ({ instructions }: Props) => {
    return (
        <table className="instruction-table">
            <tbody>
            {instructions.map((ins) => (
                <InstructionTableRow key={ins.code} instruction={ins} />
            ))}
            </tbody>
        </table>
    );
};

export default InstructionTable;
