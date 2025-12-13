import { useComputron } from "../api/ComputronContext";
import svgIcons from "./assets/svgs.ts";
import "./ram.css";

// const ROWS = 8192;
const WORDS_PER_ROW = 8;
const MEMORY_SIZE = 65536;

export default function Ram() {
  const { state } = useComputron();

  const memory = state?.memory ?? (() => {
    const mem = new Array(MEMORY_SIZE).fill(0);

    mem[0x0000] = 0x0020;
    mem[0x0001] = 0x1234;
    mem[0x0002] = 0xABCD;

    mem[0x0008] = 0x00FF;
    mem[0x0009] = 0x0100;
    mem[0x000A] = 0x7777;

    mem[0x007F] = 0xDEAD;

    // mem[0x0C05] = 0xDAD0;

    return mem;
  })();


  // const pc = state?.pc ?? 0;
  const base = 0;

  function toHex16(value: number): string {
    return (value & 0xffff).toString(16).toUpperCase().padStart(4, "0");
  }

  const lastNonZeroIndex = memory.reduce((last, value, i) => (value !== 0 ? i : last), 0);
  const totalRows = Math.ceil((lastNonZeroIndex + 1) / WORDS_PER_ROW);
  const slice = memory.slice(0, totalRows * WORDS_PER_ROW);

  const rows: number[][] = [];
  for (let i = 0; i < totalRows; i++) {
    rows.push(slice.slice(i * WORDS_PER_ROW, (i + 1) * WORDS_PER_ROW));
  }

  return (
      <div className="ram-wrapper">
        {/* Title, 3 buttons*/}
        <div className="ram-header">
          <div className="ram-title">RAM</div>
          <div className="ram-controls">
            <div className="ram-buttons-left">
              <button className="ram-button">
                <svg className="button-icon-svg" fill="none" viewBox="0 0 10 10">
                  <path d={svgIcons.ram_load} fill="white" />
                </svg>
                Load
              </button>
              <button className="ram-button">
                <svg className="button-icon-svg" fill="none" viewBox="0 0 10 10">
                  <path d={svgIcons.ram_store} fill="white" />
                </svg>
                Store
              </button>
            </div>
            <button className="ram-button">
              <svg className="button-icon-svg" fill="none" viewBox="0 0 10 10">
                <path d={svgIcons.ram_run} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
              </svg>
              Run
            </button>
          </div>
        </div>


        <div className="ram-table">
          <div className="ram-container">
            {rows.map((rowWords, i) => {
              const addr = base + i * WORDS_PER_ROW * 2;
              // console.log(addr);
              // console.log(rowWords);
              // // print all words in the row
              // rowWords.forEach((word, i) => {
              //   console.log(`  Word ${i}: ${word}`);
              // })


              return (
                  <div key={addr} className="ram-row">
                    {/* Address */}
                    <div className="ram-addr-column">
                      0x{addr.toString(16).toUpperCase().padStart(4, "0")}
                    </div>

                    {/*Corresponding line of words*/}
                    <div className="ram-grid">
                      {rowWords.map((word, j) => {
                        const val = Number(word ?? 0);
                        return (
                            <div key={j} className={`ram-cell ${val !== 0 ? "nonzero" : ""}`}>
                              {toHex16(val)}
                            </div>
                        );
                      })}
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
      </div>
  );
}