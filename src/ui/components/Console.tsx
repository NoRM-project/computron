import './console.css';
import svgs from "./assets/svgs.ts";
import { useEffect, useRef, useState } from "react";
import {type ConsoleData, useComputron} from "../api/ComputronContext.tsx";

const MOCK = true;

export default function Console() {
    const [collapsed, setCollapsed] = useState(false);

    // ---- REAL (from context)
    const computron = useComputron();

    // ---- MOCK STATE
    const [mockOutput, setMockOutput] = useState<ConsoleData[]>([]);
    const [mockInputRequested, setMockInputRequested] = useState(false);

    // ---- ACTIVE SOURCE
    const consoleOutput = MOCK ? mockOutput : computron.consoleOutput;
    const inputRequested = MOCK ? mockInputRequested : computron.inputRequested;

    const [inputValue, setInputValue] = useState<string | "">("");
    const bottomRef = useRef<HTMLDivElement>(null);

    // ---- MOCK INIT
    useEffect(() => {
        if (!MOCK) return;

        setMockOutput([
            { type: 'out', value: 'Program started' },
            { type: 'out', value: 'Enter number:' }
        ]);
        setMockInputRequested(true);
    }, []);

    // ---- AUTO SCROLL
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [consoleOutput, inputRequested]);

    // ---- SUBMIT
    const handleSubmit = () => {
        if (inputValue === "") return;

        if (MOCK) {
            setMockOutput(prev => [
                ...prev,
                { type: 'in', value: String(inputValue) },
                { type: 'out', value: `Echo: ${inputValue}` }
            ]);
            setMockInputRequested(true);
        } else {
            computron.consoleInput(inputValue);
        }

        setInputValue("");
    };

    // ---- CLEAN
    const handleClean = () => {
        if (MOCK) setMockOutput([]);
        else computron.cleanConsole();
    };

    return (
        <div className={`console-container container ${collapsed ? "collapsed" : ""}`}>
            <div className="console-header">
                <div className="console-left">
                    <button
                        className="collapse-button"
                        onClick={() => setCollapsed(c => !c)}
                    >
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                            <path
                                d={svgs.collapse_button}
                                stroke="#F5F5F5"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <span className="console-title">Console</span>
                </div>

                <button className="clean-up" onClick={handleClean}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d={svgs.console_clear} fill="#E3E3E3" />
                    </svg>
                </button>
            </div>

            <div className="console-output scrollable">
                {consoleOutput.map((entry, i) => (
                    <div key={i}>
                        {entry.type === 'out' ? '>> ' : '<< '}
                        {entry.value}
                    </div>
                ))}

                {inputRequested && (
                    <div className="console-input-line">
                        {'<< '}
                        <input
                            type="number"
                            autoFocus
                            value={inputValue}
                            onChange={e =>
                                setInputValue(
                                    e.target.value === "" ? "" : String(e.target.value)
                                )
                            }
                            onKeyDown={e => {
                                if (e.key === "Enter") handleSubmit();
                            }}
                        />
                    </div>
                )}

                <div ref={bottomRef} />
            </div>
        </div>
    );
}
