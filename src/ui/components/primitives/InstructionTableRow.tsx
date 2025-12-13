import type { Instruction } from "../Helper.tsx";

type Props = {
    instruction: Instruction;
};

const InstructionTableRow = ({ instruction }: Props) => {
    return (
        <tr className="table-row {style}">
            <td>{instruction.code}</td>
            <td>{instruction.name}</td>
            <td>{instruction.attrib}</td>
        </tr>
    );
};

export default InstructionTableRow;
