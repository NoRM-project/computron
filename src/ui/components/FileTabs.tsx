import { useRef } from "react";
import svgPaths from "./assets/svgs.ts";
import "./filetab.css";
import {useComputron} from "../api/ComputronContext.tsx";

export default function FileTabs() {

  const { compile, saveFile, files, activeFile, updateActiveFile, closeFile, setActiveFile, openFile } = useComputron();

  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleCompile = () => {
    saveFile();
    if(activeFile) compile(activeFile.content, false);
  };

  const handleRun = () => {
    saveFile();
    if(activeFile) compile(activeFile.content, true);
  };


  const syncScroll = () => {
    if (!editorWrapperRef.current || !lineNumbersRef.current) return;
    const scrollTop = editorWrapperRef.current.scrollTop;
    lineNumbersRef.current.scrollTop = scrollTop;
  };

  const lines = activeFile ? Math.max(activeFile.content.split("\n").length, 1) : 1;

  return (
      <div className="files-container container">
        <button onClick ={openFile} > open file </button>
        {/* Tabs header */}
        <div className="file-tabs-container">
          <div className="file-tabs-scrollable">
            <div className="text-font-bold tabs-section ">
              {files.map((file) => {
                const isActive = activeFile?.name === file.name; // або порівнювати path
                return (
                    <div
                        key={file.name}
                        className={`tab ${isActive ? "active" : "inactive"}`}
                        onClick={() => setActiveFile(file)}
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