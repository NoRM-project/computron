import './console.css';
import svgs from "./assets/svgs.ts";
import { useEffect, useRef, useState } from "react";
import { type ConsoleData, useComputron } from "../context/ComputronContext.tsx";

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

    const RX = {
        // allow empty while typing; submit will be stricter
        intTyping: /^-?\d*$/,
        intSubmit: /^-?\d+$/,

        // float: allow "1", "1.", "1.2", ".2", "-.2" while typing
        floatTyping: /^-?(?:\d*(?:\.\d*)?)$/,
        // submit: require at least one digit somewhere
        floatSubmit: /^-?(?:\d+(\.\d+)?|\.\d+)$/,

        // char: allow empty while typing; submit requires exactly 1 char
        charTyping: /^.?$/,
        charSubmit: /^.$/,
    } as const;

    function getRegex(type: Exclude<InputType, null>, phase: 'typing' | 'submit') {
        if (type === 'int') return phase === 'typing' ? RX.intTyping : RX.intSubmit;
        if (type === 'float') return phase === 'typing' ? RX.floatTyping : RX.floatSubmit;
        return phase === 'typing' ? RX.charTyping : RX.charSubmit;
    }

    // ---- СИНХРОНІЗАЦІЯ з context
    useEffect(() => {
        if (computron.consoleOutput.length > 0) {
            setLocalConsoleOutput(prev => {
                const newEntries = computron.consoleOutput.filter(entry =>
                    !prev.some(e => e.type === entry.type && e.value === entry.value)
                );
                return [...prev, ...newEntries];
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

    // ---- SUBMIT (uses submit-regex)
    const handleSubmit = () => {
        if (inputRequested === null) return;

        const v = inputValue.trim();
        if (v === "") return;

        const rx = getRegex(inputRequested, 'submit');
        if (!rx.test(v)) return;

        const submittedValue = v;

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
        switch (type) {
            case 'out': return '>> ';
            case 'in': return '<< ';
            case 'err': return '!! ';
            default: return '';
        }
    };

    const getEntryClass = (type: ConsoleData['type']) => {
        switch (type) {
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
                        <span className="prompt">{'<<'}&nbsp;</span>
                        <input
                            className='text-font'
                            type="text"
                            autoFocus
                            value={inputValue}
                            onChange={e => {
                                const v = e.target.value;

                                // live validation: block invalid keystrokes
                                const rx = getRegex(inputRequested, 'typing');
                                if (!rx.test(v)) return;

                                setInputValue(v);
                            }}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />
                    </div>
                )}

                <div ref={bottomRef} />
            </div>
        </div>
    );
}
