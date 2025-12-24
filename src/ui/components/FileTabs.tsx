import {useEffect, useRef} from "react";
import svgPaths from "./assets/svgs.ts";
import "./filetab.css";
import {useComputron} from "../context/ComputronContext.tsx";

export default function FileTabs() {

  const { compile, saveFile, files, activeFile, updateActiveFile, closeFile, setActiveFileId, compilationErrorLine } = useComputron();

  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleCompile = async () => {
    await saveFile();
    if(activeFile) compile(activeFile.content.replaceAll("'", ""), false);
  };

  const handleRun = async () => {
    await saveFile();
    if(activeFile) compile(activeFile.content.replaceAll("'", ""), true);
  };

  const tabsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;

      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const syncScroll = () => {
    if (!editorWrapperRef.current || !lineNumbersRef.current) return;
    const scrollTop = editorWrapperRef.current.scrollTop;
    lineNumbersRef.current.scrollTop = scrollTop;

    if (overlayRef.current) {
      overlayRef.current.scrollTop = scrollTop;
    }
  };

  const lines = activeFile ? Math.max(activeFile.content.split("\n").length, 1) : 0;

  return (
      <div className="files-container container">
        {/*<button onClick ={openFile} > open file </button>*/}
        {/* Tabs header */}
        <div className="file-tabs-container">
          <div className="file-tabs-scrollable">
            <div className="text-font-bold tabs-section" ref={tabsScrollRef}>
              {files.map((file) => {
                const isActive = activeFile?.id === file.id;
                return (
                    <div
                        key={file.name}
                        className={`tab ${isActive ? "active" : "inactive"}`}
                        onClick={() => setActiveFileId(file.id)}
                    >
                      <span className="tab-name">{file.name}</span>
                          <button
                              className="tab-close-btn"
                              onClick={(e) => { e.stopPropagation(); closeFile(file); }}
                          >
                            <svg className="close-icon" fill="none" viewBox="0 0 9 9">
                              <path
                                  d={svgPaths.file_tab_close}
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.3"
                              />
                            </svg>
                          </button>
                    </div>
                );
              })}
            </div>
          </div>

          <div className="actions-section">
            <button className="action-btn" onClick={handleCompile}>
              <svg className="action-icon" fill="none" viewBox="0 0 16 10">
                <path d={svgPaths.file_tab_compile_gear} fill="white" />
                <path d={svgPaths.file_tab_compile_bracets} fill="white" />
              </svg>
              Compile
            </button>
            <button className="action-btn" onClick={handleRun}>
              <svg className="action-icon-play" fill="none" viewBox="0 0 9 10">
                <path
                    d={svgPaths.file_tab_run}
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                />
              </svg>
              Run
            </button>
          </div>
        </div>

        {/* Editor */}
        <div
            className="editor-wrapper"
            ref={editorWrapperRef}
            onScroll={syncScroll}
        >
          <div className="editor-content">

            <div className="editor-overlay" ref={overlayRef}>
              {Array.from({ length: lines }, (_, i) => (
                  <div
                      key={i}
                      className={`overlay-line ${
                          compilationErrorLine === i + 1 ? "error-line" : ""
                      }`}
                  />
              ))}
            </div>

            <div className="line-numbers" ref={lineNumbersRef}>
              {Array.from({ length: lines }, (_, i) => (
                  <div key={i} className="line-number">{i + 1}</div>
              ))}
            </div>

            <textarea
                className="code-editor"
                value={activeFile ? activeFile.content : ""}
                onChange={(e) => updateActiveFile(e.target.value)}
                spellCheck={false}
                rows={lines}
                disabled={!activeFile}
            />
          </div>
        </div>
      </div>
  );
}