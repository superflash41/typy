import { invoke } from "@tauri-apps/api/core";
import "./styles/App.css";
import TypingTest from "./components/TypingTest";
import ThemeToggle from "./components/ThemeToggle";
// import StatsDisplay from "./components/StatsDisplay";

function App() {

  return (
    <main className="container">
      <ThemeToggle />
      <div style={{ margin: "2rem" }}>
        <TypingTest />
        {/* <StatsDisplay /> */}
      </div>
    </main>
  );
}

export default App;
