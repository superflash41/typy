// import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import "./styles/App.css";
import TypingTest from "./components/TypingTest";
import ThemeToggle from "./components/ThemeToggle";
import StatsHistory from "./components/StatsHistory";

function App() {
  const [activeTab, setActiveTab] = useState('typing');
  const [showSettings, setShowSettings] = useState(true);

  return (
    <main className="container">
      <div className="app-header">
        <div className="app-branding">
          <img src="/typy-logo.png" alt="Typy logo" className="app-logo" />
          <h1>Typy</h1>
        </div>
        <div className="app-controls">
          <ThemeToggle />
          <button
            className="focus-mode-toggle"
            onClick={() => setShowSettings(!showSettings)}
            title={showSettings ? "Hide settings (focus mode)" : "Show settings"}
          >
            {showSettings ? "Focus Mode" : "Show Settings"}
          </button>
        </div>
      </div>

      <div className="content">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'typing' ? 'active' : ''}`}
            onClick={() => setActiveTab('typing')}
          >
            Typing Test
          </button>
          <button
            className={`nav-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            History & Stats
          </button>
        </div>

        {activeTab === 'typing' && <TypingTest initialShowSettings={showSettings} onSettingsVisibilityChange={setShowSettings} />}
        {activeTab === 'stats' && <StatsHistory />}
      </div>
    </main>
  );
}

export default App;
