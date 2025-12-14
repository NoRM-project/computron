import { useState, useRef } from "react";
import svgPaths from "./assets/svgs.ts";
import "./filetab.css";

type FileTab = {
  id: string;
  name: string;
  content: string;
};

export default function FileTabs() {
  const [tabs, setTabs] = useState<FileTab[]>([
    { id: "1", name: "main.asm", content: "" },
    { id: "2", name: "utils.asm", content: "" },
  ]);

  const [activeTabId, setActiveTabId] = useState("1");
  const activeTab = tabs.find((t) => t.id === activeTabId)!;

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const updateContent = (value: string) => {
    setTabs((tabs) =>
        tabs.map((tab) =>
            tab.id === activeTabId ? { ...tab, content: value } : tab
        )
    );
  };

  const handleCompile = () => {
    console.log("Compile:", activeTab.name);
    console.log(activeTab.content);
  };

  const handleRun = () => {
    console.log("Run:", activeTab.name);
    console.log(activeTab.content);
  };

  const handleCloseTab = (id: string) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);
    if (id === activeTabId) setActiveTabId(newTabs[0].id);
  };

  // const handleAddTab = () => {
  //   const newId = String(Date.now());
  //   const newTab: FileTab = { id: newId, name: `file${tabs.length + 1}.asm`, content: "" };
  //   setTabs([...tabs, newTab]);
  //   setActiveTabId(newId);
  // };

  const lines = activeTab.content.split("\n").length;

  const syncScroll = () => {
    if (!editorRef.current || !lineNumbersRef.current || !textareaRef.current) return;
    const scrollTop = editorRef.current.scrollTop;
    lineNumbersRef.current.scrollTop = scrollTop;
    textareaRef.current.scrollTop = scrollTop;
  };

  return (
      <div className="files-container container">
        {/* Tabs header */}
        <div className="file-tabs-container">
          <div className="tabs-section text-font-bold">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                  <div
                      key={tab.id}
                      className={`tab ${isActive ? "active" : "inactive"}`}
                      onClick={() => setActiveTabId(tab.id)}
                  >
                    <span className="tab-name">{tab.name}</span>
                    {tabs.length > 1 && (
                        <button
                            className="tab-close-btn"
                            onClick={(e) => { e.stopPropagation(); handleCloseTab(tab.id); }}
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
                    )}
                  </div>
              );
            })}
            {/*<button className="add-tab-btn" onClick={handleAddTab}>+</button>*/}
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
        <div className="editor-wrapper scrollable" ref={editorRef} onScroll={syncScroll}>
          <div className="line-numbers" ref={lineNumbersRef}>
            {Array.from({ length: lines }, (_, i) => (
                <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
              className="code-editor"
              ref={textareaRef}
              value={activeTab.content}
              onChange={(e) => updateContent(e.target.value)}
              spellCheck={false}
          />
        </div>
      </div>
  );
}
