import { useComputron } from "../api/ComputronContext";
import "./ram.css";

const MEMORY_SIZE = 65536;
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
      <div className="ram-container">
        {rows.map((rowWords, i) => {
          const addr = base + i * WORDS_PER_ROW;

          return (
              <div key={addr} className={`ram-row ${addr === pc ? "pc" : ""}`}>
            <span className="ram-addr">
              0x{addr.toString(16).padStart(4, "0")}
            </span>
                <span className="ram-sep">|</span>
                <span className="ram-bits">
              {rowWords.map(toHex16).join(" ")}
            </span>
              </div>
          );
        })}
      </div>
  );
}