import './console.css';
import svgs from "./assets/svgs.ts";
import { useEffect, useRef, useState } from "react";
import {type ConsoleData, useComputron} from "../api/ComputronContext.tsx";

export default function Console() {
    const [collapsed, setCollapsed] = useState(false);

    // ---- REAL (from context)
    const computron = useComputron();

    // ---- ЛОКАЛЬНЕ ЗБЕРІГАННЯ для real режиму
    const [localConsoleOutput, setLocalConsoleOutput] = useState<ConsoleData[]>([]);

    // ---- ACTIVE SOURCE
    const consoleOutput = localConsoleOutput;
    const inputRequested: InputType = computron.inputRequested;

    const [inputValue, setInputValue] = useState<string>("");
    const [inputKey, setInputKey] = useState(0);
    const bottomRef = useRef<HTMLDivElement>(null);

    const INPUT_REGEX: Record<Exclude<InputType, null>, RegExp> = {
        int: /^-?\d+$/,
        float: /^-?\d+(\.\d+)?$/,
        char: /^.$/
    };

    // ---- СИНХРОНІЗАЦІЯ з context
    useEffect(() => {
        if (computron.consoleOutput.length > 0) {
            setLocalConsoleOutput(prev => {
                // Перевіряємо чи є нові записи
                const lastLocal = prev[prev.length - 1];
                const lastContext = computron.consoleOutput[computron.consoleOutput.length - 1];

                // Якщо останній запис різний, додаємо нові
                if (!lastLocal ||
                    lastLocal.type !== lastContext.type ||
                    lastLocal.value !== lastContext.value ||
                    computron.consoleOutput.length > prev.length) {

                    // Додаємо всі записи з context що відсутні локально
                    const newEntries = computron.consoleOutput.slice(prev.length);
                    return [...prev, ...newEntries];
                }

                return prev;
            });
        }
    }, [computron.consoleOutput]);

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

        // Додаємо input локально одразу
        setLocalConsoleOutput(prev => [
            ...prev,
            { type: 'in', value: submittedValue }
        ]);

        // Відправляємо в context
        computron.consoleInput(submittedValue);

        setInputValue("");
    };

    // ---- CLEAN
    const handleClean = () => {
        setLocalConsoleOutput([]);
        computron.cleanConsole();
    };

    // ---- ВИЗНАЧЕННЯ СТИЛЮ для різних типів
    const getEntryPrefix = (type: ConsoleData['type']) => {
        switch(type) {
            case 'out': return '>> ';
            case 'in': return '<< ';
            case 'err': return '!! ';
            default: return '';
        }
    };

    const getEntryClass = (type: ConsoleData['type']) => {
        switch(type) {
            case 'err': return 'console-entry-error';
            case 'in': return 'console-entry-input';
            case 'out': return 'console-entry-output';
            default: return '';
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

            <div className="console-output scrollable text-font">
                {consoleOutput.map((entry, i) => (
                    <div key={`entry-${i}`} className={getEntryClass(entry.type)}>
                        {getEntryPrefix(entry.type)}
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