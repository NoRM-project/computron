import './helper.css';
import instructionsJson from '../assets/instructions.json';
import {useState} from "react";
import InstructionTable from "./primitives/InstructionTable.tsx";

export type Instruction = {
    code: string;
    name: string;
    attrib: string;
    description: string;
};

export default function Helper() {
    const [search, setSearch] = useState("");
    const [instructions] = useState<Instruction[]>(instructionsJson);

    return (
        <div className="helper-container container">
            <div className="helper-header">
                <div className="helper-input-wrapper" style={{position: 'relative', width: '100%'}}>
                    <input
                        type="text"
                        placeholder="Value"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="helper-search"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                    >
                        <path
                            d="M10.75 10.75L8.33333 8.33334M9.63891 5.19443C9.63891 7.64902 7.64906 9.63885 5.19446 9.63885C2.73985 9.63885 0.75 7.64902 0.75 5.19443C0.75 2.73984 2.73985 0.75 5.19446 0.75C7.64906 0.75 9.63891 2.73984 9.63891 5.19443Z"
                            stroke="#747475" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
            <InstructionTable instructions={search === '' ? instructions : instructions.filter(
                instruction =>
                    instruction.name.toLowerCase().includes(search.toLowerCase()) ||
                    instruction.code.toLowerCase().includes(search.toLowerCase()) ||
                    instruction.attrib.toLowerCase().includes(search.toLowerCase()) ||
                    instruction.description.toLowerCase().includes(search.toLowerCase())
            )}/>
        </div>
    );
}
