import './console.css'
import './assets/svgs.ts'
import svgs from "./assets/svgs.ts";
import {useEffect, useState} from "react";

export default function Console() {
    const [output, setOutput] = useState<string[]>([]);
    const [collapsed, setCollapsed] = useState(false);

    // test output
    useEffect(() => {
        let count = 0;
        const interval = setInterval(() => {
            setOutput((prev) => [...prev, `Output line ${count++}`]);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


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

                <button className="clean-up" onClick={() => setOutput([])}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d={svgs.console_clear} fill="#E3E3E3" />
                    </svg>
                </button>
            </div>

            <div className="console-output">
                {output.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
        </div>
    );
}
