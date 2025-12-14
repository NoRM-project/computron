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
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2.08333 10C1.73958 10 1.44531 9.89509 1.20052 9.68527C0.955729 9.47545 0.833333 9.22321 0.833333 8.92857V1.78571H0V0.714286H3.33333V0H6.66667V0.714286H10V1.78571H9.16667V8.92217C9.16667 9.22406 9.04427 9.47917 8.79948 9.6875C8.55469 9.89583 8.26042 10 7.91667 10H2.08333ZM7.91667 1.78571H2.08333V8.92857H7.91667V1.78571Z" fill="#E3E3E3"/>
                </svg>
            </button>
        </div>


        {!collapsed && (
            <div className="console-output scrollable">
                {output.length === 0 ? '' : output.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
        )}
    </div>
  )
}
