import { useComputron } from "../api/ComputronContext";
import "./ram.css";

// const MEMORY_SIZE = 65536;
const ROWS = 16;
const WORDS_PER_ROW = 8;

export default function Ram() {
  const { state } = useComputron();

  const memory = state?.memory ?? new Array(ROWS * WORDS_PER_ROW).fill(0);
  const pc = state?.pc ?? 0;
  const base = Math.max(0, pc);
  const slice = memory.slice(base, base + ROWS * WORDS_PER_ROW);

  function toHex16(value: number): string {
    return (value & 0xffff).toString(16).toUpperCase().padStart(4, "0");
  }

  const rows: number[][] = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push(slice.slice(i * WORDS_PER_ROW, (i + 1) * WORDS_PER_ROW));
  }

  return (
      <div className="ram-wrapper">
        <div className="ram-header">
          <div className="ram-title">RAM</div>

          <div className="ram-controls">
            <div className="ram-buttons-left">
              <button className="ram-button">
                <span className="button-icon">↓</span>
                Load
              </button>
              <button className="ram-button">
                <span className="button-icon">↑</span>
                Store
              </button>
            </div>
            <button className="ram-button">
              <span className="button-icon">▶</span>
              Run
            </button>
          </div>
        </div>

        <div className="ram-table">
          <div className="ram-container">
            {rows.map((rowWords, i) => {
              const addr = base + i * WORDS_PER_ROW;
              const isRowHighlighted = Math.floor((pc - base) / WORDS_PER_ROW) === i;

              return (
                  <div key={addr} className="ram-row">
                    <div className="ram-addr-column">
                      0x{addr.toString(16).toUpperCase().padStart(4, "0")}
                    </div>

                    <div className="ram-grid">
                      {rowWords.map((word, j) => (
                          <div
                              key={j}
                              className={`ram-cell ${isRowHighlighted ? "highlighted" : ""}`}
                          >
                            {toHex16(word)}
                          </div>
                      ))}
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
      </div>
  );
}