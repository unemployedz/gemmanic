"use client";

import { useMemo, useState } from "react";
import {
  Activity, Archive, ArrowDown, ArrowUp, AudioLines, BookOpen, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, Code2, Command, File, FilePlus2,
  Folder, FolderPlus, Globe2, LayoutGrid, Menu, MessageSquare, MoreHorizontal,
  PanelLeftClose, Paperclip, Plus, Search, Send, Settings2, Sparkles, SquarePen,
  X, Zap
} from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string; reasoning?: string };

const starterPrompts = [
  { title: "Explore an idea", detail: "Think through a concept step by step", icon: Sparkles },
  { title: "Explain something", detail: "Make a difficult topic easier to understand", icon: BookOpen },
  { title: "Draft a plan", detail: "Turn a goal into clear next steps", icon: LayoutGrid },
  { title: "Review some text", detail: "Improve clarity and structure", icon: File }
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mode, setMode] = useState<"chat" | "code">("chat");
  const [modelOpen, setModelOpen] = useState(false);
  const [model, setModel] = useState("Gemma 4 E4B");
  const [composer, setComposer] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reasoningOpen, setReasoningOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("New session");
  const [projectOpen, setProjectOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [sessions, setSessions] = useState(["New session", "Research notes", "Untitled conversation"]);
  const [projects, setProjects] = useState(["Personal workspace", "Gemma experiments"]);
  const [fileName, setFileName] = useState("notes.md");

  const hasMessages = messages.length > 0;
  const statusLabel = useMemo(() => mode === "chat" ? "Chat" : "Code workspace", [mode]);

  function sendMessage(value = composer) {
    const clean = value.trim();
    if (!clean) return;
    setMessages(current => [...current, { role: "user", content: clean }]);
    setComposer("");
    setReasoningOpen(false);
    window.setTimeout(() => {
      setMessages(current => [...current, {
        role: "assistant",
        content: "The workspace interface is ready. Connect a model provider to enable live responses.",
        reasoning: "The message was received by the interface. No inference provider is configured yet, so this is a local preview response."
      }]);
    }, 450);
  }

  function newSession() {
    const name = "New session";
    setActiveTab(name);
    setMessages([]);
    setSessions(current => [name, ...current.filter(item => item !== name)]);
  }

  return (
    <main className="shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="brand-row">
          <div className="brand-mark"><span>G</span></div>
          {sidebarOpen && <><div className="brand-name">gemmanic</div><button className="icon-button push-right" aria-label="Collapse sidebar" onClick={() => setSidebarOpen(false)}><PanelLeftClose size={17}/></button></>}
        </div>
        {sidebarOpen && <>
          <button className="workspace-select"><span className="workspace-dot"/> Personal workspace <ChevronDown size={14}/></button>
          <div className="sidebar-actions">
            <button onClick={newSession}><SquarePen size={16}/> New session <span className="shortcut">⌘ K</span></button>
            <button><Search size={16}/> Search <span className="shortcut">⌘ F</span></button>
          </div>
          <div className="side-section">
            <div className="section-heading">WORKSPACE <button aria-label="Add project" onClick={() => setProjects(p => ["New project", ...p])}><Plus size={14}/></button></div>
            {projects.map((project, index) => <button className="side-item" key={project}><Folder size={15}/><span>{project}</span><MoreHorizontal size={15} className="side-more"/></button>)}
          </div>
          <div className="side-section session-section">
            <div className="section-heading">RECENT SESSIONS <button aria-label="New session" onClick={newSession}><Plus size={14}/></button></div>
            {sessions.map((session, index) => <button key={session + index} className={`side-item ${activeTab === session ? "side-item-active" : ""}`} onClick={() => {setActiveTab(session);setMessages([]);}}><MessageSquare size={15}/><span>{session}</span><MoreHorizontal size={15} className="side-more"/></button>)}
          </div>
          <div className="sidebar-bottom">
            <button className="side-item"><Settings2 size={16}/> Settings</button>
            <button className="profile-row"><div className="profile-avatar">U</div><span><b>Workspace user</b><small>Personal account</small></span><MoreHorizontal size={16}/></button>
          </div>
        </>}
        {!sidebarOpen && <button className="icon-button sidebar-expand" aria-label="Open sidebar" onClick={() => setSidebarOpen(true)}><PanelLeftClose size={18}/></button>}
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            {!sidebarOpen && <button className="icon-button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><Menu size={18}/></button>}
            <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14}/><b>{activeTab}</b></div>
          </div>
          <div className="topbar-right">
            <div className="mode-switch">
              <button className={mode === "chat" ? "mode-active" : ""} onClick={() => setMode("chat")}><MessageSquare size={14}/> Chat</button>
              <button className={mode === "code" ? "mode-active" : ""} onClick={() => setMode("code")}><Code2 size={14}/> Code</button>
            </div>
            <button className="icon-button optional-action" onClick={() => setInspectorOpen(v => !v)} aria-label="Toggle inspector"><PanelLeftClose size={17}/></button>
            <button className="icon-button" aria-label="Help"><CircleHelp size={17}/></button>
          </div>
        </header>

        <div className="workspace">
          <div className="content-column">
            <div className="tab-strip">
              <button className="tab-active"><MessageSquare size={14}/>{activeTab}<X size={13}/></button>
              <button className="icon-button tab-add" onClick={newSession} aria-label="New tab"><Plus size={15}/></button>
              <span className="tab-spacer"/>
              <button className="icon-button" aria-label="More tabs"><MoreHorizontal size={17}/></button>
            </div>

            {mode === "chat" ? (
              <div className={`chat-view ${hasMessages ? "chat-view-active" : ""}`}>
                {!hasMessages ? (
                  <div className="welcome">
                    <div className="gemma-orb"><div className="orb-core">G</div><div className="orb-ring orb-ring-one"/><div className="orb-ring orb-ring-two"/></div>
                    <div className="eyebrow"><span className="eyebrow-line"/> YOUR AI WORKSPACE <span className="eyebrow-line"/></div>
                    <h1>What are we working on?</h1>
                    <p className="welcome-subtitle">A clear space to think, explore, and create.</p>
                    <div className="prompt-grid">
                      {starterPrompts.map(({title,detail,icon:Icon}) => <button className="prompt-card" key={title} onClick={() => sendMessage(title)}><span className="prompt-icon"><Icon size={17}/></span><span><b>{title}</b><small>{detail}</small></span><ArrowUp size={14} className="prompt-arrow"/></button>)}
                    </div>
                  </div>
                ) : (
                  <div className="conversation">
                    {messages.map((message, index) => <article className={`message message-${message.role}`} key={index}>
                      <div className="message-avatar">{message.role === "user" ? "U" : <span>G</span>}</div>
                      <div className="message-body">
                        <div className="message-meta">{message.role === "user" ? "You" : "Gemmanic"} <span>{message.role === "assistant" ? "Just now" : "Sent"}</span></div>
                        <p>{message.content}</p>
                        {message.reasoning && <div className="reasoning"><button onClick={() => setReasoningOpen(v => !v)}><Activity size={14}/> Reasoning <ChevronDown size={14} className={reasoningOpen ? "rotate" : ""}/></button>{reasoningOpen && <div className="reasoning-content">{message.reasoning}</div>}</div>}
                      </div>
                    </article>)}
                  </div>
                )}
                <div className="composer-wrap">
                  <div className="composer">
                    <textarea value={composer} onChange={event => setComposer(event.target.value)} onKeyDown={event => {if(event.key === "Enter" && !event.shiftKey){event.preventDefault();sendMessage();}}} placeholder={mode === "chat" ? "Ask anything..." : "Describe what you want to build..."} rows={2}/>
                    <div className="composer-footer">
                      <div className="composer-tools">
                        <button className="tool-button" aria-label="Attach file"><Paperclip size={16}/><span>Attach</span></button>
                        <button className="tool-button" onClick={() => setInspectorOpen(v => !v)}><Plus size={16}/><span>Context</span></button>
                      </div>
                      <div className="composer-right">
                        <button className="model-button" onClick={() => setModelOpen(true)}><span className="model-indicator"/> {model}<ChevronDown size={13}/></button>
                        <button className="send-button" onClick={() => sendMessage()} disabled={!composer.trim()} aria-label="Send message"><Send size={16}/></button>
                      </div>
                    </div>
                  </div>
                  <div className="composer-note">Gemmanic preview · Responses are simulated until a model is connected</div>
                </div>
              </div>
            ) : (
              <div className="code-view">
                <div className="code-toolbar"><div><Code2 size={16}/> <b>Workspace editor</b><span className="muted">Preview only</span></div><button className="small-button" onClick={() => setFileName("untitled.ts")}><FilePlus2 size={14}/> New file</button></div>
                <div className="editor-layout">
                  <div className="file-list"><div className="file-list-title">FILES <Plus size={14}/></div><button className="file-row file-selected"><File size={14}/>{fileName}</button><button className="file-row"><File size={14}/>README.md</button></div>
                  <div className="editor-empty"><div className="editor-icon"><Code2 size={24}/></div><h2>Code workspace</h2><p>The editor shell is ready. File execution and local computer access are intentionally not included.</p><div className="editor-file-label">{fileName}</div></div>
                </div>
              </div>
            )}
          </div>

          {inspectorOpen && <aside className="inspector">
            <div className="inspector-head"><b>Context</b><button className="icon-button" onClick={() => setInspectorOpen(false)} aria-label="Close context"><X size={16}/></button></div>
            <div className="inspector-block"><span className="inspector-label">PROJECT</span><div className="inspector-row"><Folder size={15}/> Personal workspace</div></div>
            <div className="inspector-block"><span className="inspector-label">FILES</span><button className="inspector-row"><File size={15}/> notes.md</button><button className="inspector-row"><File size={15}/> README.md</button><button className="add-context"><Plus size={14}/> Add context</button></div>
            <div className="inspector-hint"><Globe2 size={16}/><span>Project context will be shared across sessions in this workspace.</span></div>
          </aside>}
        </div>
      </section>

      {modelOpen && <div className="modal-backdrop" onMouseDown={event => {if(event.target === event.currentTarget) setModelOpen(false);}}>
        <div className="model-modal">
          <div className="modal-heading"><div><span className="modal-kicker">MODEL LIBRARY</span><h2>Select a model</h2></div><button className="icon-button" onClick={() => setModelOpen(false)} aria-label="Close model picker"><X size={18}/></button></div>
          <div className="model-search"><Search size={16}/><input placeholder="Search models"/></div>
          <div className="model-group-title">AVAILABLE MODELS</div>
          {["Gemma 4 E4B","Gemma 3 12B","Llama 3.3 70B","Qwen 2.5 Coder"].map((item,index) => <button className={`model-option ${model === item ? "model-option-active" : ""}`} key={item} onClick={() => {setModel(item);setModelOpen(false);}}><span className="model-option-icon">{index === 0 ? "G" : <Sparkles size={16}/>}</span><span><b>{item}</b><small>{index === 0 ? "Selected workspace model" : "Model selection preview"}</small></span>{model === item && <span className="selected-check"/>}</button>)}
          <button className="add-model"><Plus size={15}/> Add a model provider</button>
          <p className="modal-footnote">Model selection is a UI preview. No inference endpoint is configured.</p>
        </div>
      </div>}
    </main>
  );
}
