import { Tooltip, Zoom } from "@mui/material";
import type { Instruction } from "../Helper.tsx";


type Props = {
    instruction: Instruction;
};

const InstructionTableRow = ({ instruction }: Props) => {
    return (
        <Tooltip 
            title={instruction.description}
            disableInteractive
            slotProps={{
                tooltip: {
                    sx: {
                        paddingLeft: 1,
                        paddingRight: 1,
                        borderRadius: 2,
                        backgroundColor: 212121,
                        backfaceVisibility: 16,
                        fontSize: 14,
                        textAlign: "center"
                    },
                },
                transition: Zoom,
                popper: {
                modifiers: [
                    {
                    name: 'offset',
                    options: {
                        offset: [0, -14],
                    },
                    },
                ],
            },
        }}>
            <tr className="table-row {style}">
                <td>{instruction.code}</td>
                <td>{instruction.name}</td>
                <td>{instruction.attrib}</td>
            </tr>
        </Tooltip>
    );
};

export default InstructionTableRow;
