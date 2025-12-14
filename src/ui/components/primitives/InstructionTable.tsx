import InstructionTableRow from "./InstructionTableRow.tsx";
import type { Instruction } from "../Helper.tsx";

type Props = {
    instructions: Instruction[];
};

const InstructionTable = ({ instructions }: Props) => {
    return (
        <table className="instruction-table ">
            <tbody className="scrollable">
            {instructions.map((ins) => (
                <InstructionTableRow key={ins.code} instruction={ins} />
            ))}
            </tbody>
        </table>
    );
};

export default InstructionTable;
