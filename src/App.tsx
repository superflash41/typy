import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import TypingTest from "./components/TypingTest";
import StatsDisplay from "./components/StatsDisplay";

function App() {

  async function fetchText() {
    const text = await invoke<string>('get_text_to_type');
    console.log(text);
  }

  // code to use the fetchText function
  async function handleClick() {
    try {
      await fetchText();
    } catch (error) {
      console.error("Error fetching text:", error);
    }
  }

  return (
    <main className="container">

      <div style={{ margin: "2ream" }}>
        <h1>Welcome to typy!</h1>
        <TypingTest />
        <StatsDisplay />
      </div>
    </main>
  );
}

export default App;
