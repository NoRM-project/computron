import './console.css';
import svgs from "./assets/svgs.ts";
import { useEffect, useRef, useState } from "react";
import {type ConsoleData, useComputron} from "../api/ComputronContext.tsx";

type InputType = 'int' | 'float' | 'char' | null;

const MOCK = false;
const mock_value: Exclude<InputType, null> = 'int';

export default function Console() {
    const [collapsed, setCollapsed] = useState(false);

    // ---- REAL (from context)
    const computron = useComputron();

    // ---- MOCK STATE
    const [mockOutput, setMockOutput] = useState<ConsoleData[]>([]);
    const [mockInputRequested, setMockInputRequested] = useState<InputType>(null);

    // ---- ЛОКАЛЬНЕ ЗБЕРІГАННЯ для real режиму
    const [localConsoleOutput, setLocalConsoleOutput] = useState<ConsoleData[]>([]);

    // ---- ACTIVE SOURCE
    const consoleOutput = MOCK ? mockOutput : localConsoleOutput;
    const inputRequested : InputType = MOCK ? mockInputRequested : computron.inputRequested;

    const [inputValue, setInputValue] = useState<string>("");
    const [inputKey, setInputKey] = useState(0);
    const bottomRef = useRef<HTMLDivElement>(null);


    const INPUT_REGEX: Record<Exclude<InputType, null>, RegExp> = {
        int: /^-?\d+$/,
        float: /^-?\d+(\.\d+)?$/,
        char: /^.$/
    };


    // ---- MOCK INIT
    useEffect(() => {
        if (!MOCK) return;

        setMockOutput([
            { type: 'out', value: 'Program started' },
            { type: 'out', value: 'Enter number:' }
        ]);
        setMockInputRequested(mock_value);
    }, []);

    // ---- СИНХРОНІЗАЦІЯ з context (real режим)
    useEffect(() => {
        if (!MOCK && computron.consoleOutput.length > 0) {
            // Додаємо нові дані з context до локального стейту
            setLocalConsoleOutput(prev => {
                const newEntries = computron.consoleOutput.filter(entry => {
                    // Перевіряємо чи вже є така entry
                    return !prev.some((e, i) =>
                        i < computron.consoleOutput.length &&
                        e.type === entry.type &&
                        e.value === entry.value
                    );
                });
                return [...prev, ...newEntries];
            });
        }
    }, [computron.consoleOutput, MOCK]);

    // ---- AUTO SCROLL
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [consoleOutput, inputRequested]);

    // ---- RESET INPUT коли з'являється новий запит
    useEffect(() => {
        if (inputRequested !== null) {
            setInputValue("");
            setInputKey(prev => prev + 1);
        }
    }, [inputRequested]);

    // ---- SUBMIT
    const handleSubmit = () => {
        if (inputValue === "" || inputRequested === null) return;

        const regex = INPUT_REGEX[inputRequested];
        if (!regex.test(inputValue)) {
            return;
        }

        const submittedValue = inputValue;

        if (MOCK) {
            setMockOutput(prev => [
                ...prev,
                { type: 'in', value: submittedValue }
            ]);
            setMockInputRequested(null);

            setTimeout(() => {
                setMockOutput(prev => [
                    ...prev,
                    { type: 'out', value: `Echo: ${submittedValue}` },
                    { type: 'out', value: 'Enter number:' }
                ]);
                setMockInputRequested(mock_value);
            }, 100);
        } else {
            // Додаємо input локально одразу
            setLocalConsoleOutput(prev => [
                ...prev,
                { type: 'in', value: submittedValue }
            ]);

            // Відправляємо в context
            computron.consoleInput(submittedValue);
        }

        setInputValue("");
    };


    // ---- CLEAN
    const handleClean = () => {
        if (MOCK) {
            setMockOutput([]);
            setMockInputRequested(null);
        } else {
            setLocalConsoleOutput([]);
            computron.cleanConsole();
        }
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
                    <div key={`entry-${i}`}>
                        {entry.type === 'out' ? '>> ' : '<< '}
                        {entry.value}
                    </div>
                ))}

                {inputRequested !== null && (
                    <div className="console-input-line" key={`input-${inputKey}`}>
                        {'<< '}
                        <input
                            type="text"
                            inputMode={inputRequested === 'char' ? 'text' : 'numeric'}
                            autoFocus
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
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