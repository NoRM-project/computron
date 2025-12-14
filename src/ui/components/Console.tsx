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
    <div className={`console-container container ${collapsed ? 'collapsed' : ''}`}>
        <div className="console-header">
            <div >
                <button className="collapse-button" onClick={() => setCollapsed(c => !c)}>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d={svgs.collapse_button} stroke="#F5F5F5" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                Console
            </div>
            <button className="clean-up" onClick={() => setOutput([])}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d={svgs.console_clear} stroke="#B3B3B3" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>


        {!collapsed && (
            <div className="console-output">
                {output.length === 0 ? '' : output.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
        )}
    </div>
  )
}
