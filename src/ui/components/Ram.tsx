import {useEffect, useMemo, useRef, useState} from "react";
import { useComputron } from "../api/ComputronContext";
import svgIcons from "./assets/svgs.ts";
import "./ram.css";

const MEMORY_SIZE = 65536;

const CELL_W = 40;   // px (hex cell width)
const CELL_GAP = 6;  // px (gap between cells)
const ROW_H = 22;
const ROW_GAP = 3;
const ADDR_W = 60;

function calcWordsPerRow(containerWidth: number) {
  const perCell = CELL_W + CELL_GAP;
  return Math.max(1, Math.floor((containerWidth + CELL_GAP) / perCell));
}

function calcRowsNumber(containerHeight: number) {
  const perRow = ROW_H + ROW_GAP;
  return Math.max(1, Math.floor((containerHeight + ROW_GAP) / perRow));
}

export default function Ram() {
  const { state, run, loadRam, storeRam, setRegister } = useComputron();

  const gridWidthRef = useRef<HTMLDivElement>(null);
  const [wordsPerRow, setWordsPerRow] = useState(8);
  const [rowsNumber, setRowsNumber] = useState(8);

  const tableRef = useRef<HTMLDivElement>(null);

  const [firstIndex, setFirstIndex] = useState(0)

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setRowsNumber(calcRowsNumber(rect.height));

      const gridWidth = rect.width - ADDR_W; // minus address column
      setWordsPerRow(calcWordsPerRow(gridWidth));
    });

    ro.observe(el);

    // initial
    const rect = el.getBoundingClientRect();
    setRowsNumber(calcRowsNumber(rect.height));
    setWordsPerRow(calcWordsPerRow(rect.width - ADDR_W));

    return () => ro.disconnect();
  }, []);


  const memory = state?.memory ?? (() => {
    const mem = new Array(MEMORY_SIZE).fill(0);

    mem[0x0000] = 0x0020;
    mem[0x0001] = 0x1234;
    mem[0x0002] = 0xABCD;

    mem[0x0008] = 0x00FF;
    mem[0x0009] = 0x0100;
    mem[0x000A] = 0x7777;

    mem[0x007F] = 0xDEAD;

    return mem;
  })();

  function toHex16(value: number): string {
    return (value & 0xffff).toString(16).toUpperCase().padStart(4, "0");
  }

  type RamRow = { addr: number; words: number[] };

  const rows: RamRow[] = useMemo(() => {
    const out: RamRow[] = [];

    let currentRow = 0;

    for (let start = firstIndex; start < MEMORY_SIZE; start += wordsPerRow) {
      if (currentRow >= rowsNumber) break;
      console.log("currentRow", currentRow);
      console.log("rowsNumber", rowsNumber);

      const words = memory.slice(start, start + wordsPerRow);

      // optional: pad so every row has same number of cells
      while (words.length < wordsPerRow) words.push(0);

      out.push({ addr: start, words });
      currentRow += 1;
    }

    return out;
  }, [memory, wordsPerRow, rowsNumber, firstIndex]);

  const handleRun = () => {
    if (!state) return;
    run();
  };

  const scrollUp = () => {
    const newFirstIndex = firstIndex - rowsNumber * wordsPerRow;
    setFirstIndex(Math.max(newFirstIndex, 0));
  };

  const scrollDown = () => {
    const newFirstIndex = firstIndex + rowsNumber * wordsPerRow;
    setFirstIndex(Math.max(Math.min(newFirstIndex, MEMORY_SIZE - rowsNumber * wordsPerRow), 0));
  };

  return (
      <div className="ram-wrapper">
        {/* Title, 3 buttons*/}
        <div className="ram-header">
          <div className="ram-title">RAM</div>
          <div className="ram-controls">
            <div className="ram-buttons-left">
              <button className="ram-button" onClick={() => loadRam()}>
                <svg className="button-icon-svg" fill="none" viewBox="0 0 10 10">
                  <path d={svgIcons.ram_load} fill="white" />

                </svg>
                Load
              </button>
              <button className="ram-button" onClick={() => storeRam()}>
                <svg className="button-icon-svg" fill="none" viewBox="0 0 10 10">
                  <path d={svgIcons.ram_store} fill="white" />
                </svg>
                Store
              </button>
            </div>
            <button className="ram-button" onClick={() => { if (handleRun) handleRun();}}>
              <svg className="button-icon-svg" fill="none" viewBox="0 0 10 10">
                <path d={svgIcons.ram_run} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
              </svg>
              Run
            </button>
          </div>
        </div>


        <div className="ram-table">

          <div className="ram-scroll-overlay">
            <div
                className="ram-scroll ram-scroll-up"
                onClick={scrollUp}
            >
              ▲
            </div>

            <div
                className="ram-scroll ram-scroll-down"
                onClick={scrollDown}
            >
              ▼
            </div>
          </div>


          <div className="ram-scroll-area" ref={tableRef}>
            <div className="ram-container">
              {rows.map((row) => (
                  <div key={row.addr} className="ram-row">
                    <div className="ram-addr-column">
                      0x{row.addr.toString(16).toUpperCase().padStart(4, "0")}
                    </div>

                    <div className="ram-grid" ref={row.addr === firstIndex ? gridWidthRef : undefined}>
                      {row.words.map((word, j) => {
                        const val = Number(word ?? 0);
                        const cellAddr = row.addr + j;
                        const isPC = cellAddr === (state?.pc ?? -1);
                        return (
                            <div
                                key={`${row.addr}-${j}`}
                                className={`ram-cell ${val !== 0 ? "nonzero" : ""} ${isPC ? "pc" : ""}`}
                                onClick={() => setRegister('pc', cellAddr)}
                            >
                              {toHex16(val)}
                            </div>
                        );
                      })}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}