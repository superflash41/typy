import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function StatsDisplay() {
    const [charsTyped, setCharsTyped] = useState(0);
    const [timeSeconds, setTimeSeconds] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [correctChars, setCorrectChars] = useState(0);
    const [accuracy, setAccuracy] = useState(0);

    const handleCalculateStats = async () => {
        try {
            const wpmResult = await invoke<number>("calculate_wpm", {
                charsTyped,
                timeSeconds,
            });
            setWpm(wpmResult);

            // similar for accuracy
            const accuracyResult = await invoke<number>("calculate_accuracy", {
                correctChars,
                totalChars: charsTyped,
            });
            setAccuracy(accuracyResult);
        } catch (error) {
            console.error("Error calculating stats:", error);
        }
    };

    return (
        <div style={{ marginTop: "1rem" }}>
            <h2>Stats Display</h2>

            <label>
                Characters Typed:
                <input
                    type="number"
                    value={charsTyped}
                    onChange={(e) => setCharsTyped(Number(e.target.value))}
                    style={{ marginLeft: "0.5rem" }}
                />
            </label>

            <label>
                Time (seconds):
                <input
                    type="number"
                    value={timeSeconds}
                    onChange={(e) => setTimeSeconds(Number(e.target.value))}
                    style={{ marginLeft: "0.5rem" }}
                />
            </label>

            <label>
                Correct Characters:
                <input
                    type="number"
                    value={correctChars}
                    onChange={(e) => setCorrectChars(Number(e.target.value))}
                    style={{ marginLeft: "0.5rem" }}
                />
            </label>

            <button style={{ marginLeft: "1rem" }} onClick={handleCalculateStats}>
                Calculate Stats
            </button>

            <div>
                <p>WPM: {wpm}</p>
                <p>Accuracy: {accuracy}%</p>
            </div>
        </div>
    )
}

export default StatsDisplay;
// This component is a simple stats display for a typing test.
// It allows the user to input the number of characters typed, the time taken in seconds, and the number of correct characters.
// It then calculates the words per minute (WPM) and accuracy using the Tauri API.
// The WPM is calculated using the formula: (charsTyped / 5) / (timeSeconds / 60).
// The accuracy is calculated as (correctChars / totalChars) * 100.
// The component uses React state to manage the input values and the calculated stats.
// The handleCalculateStats function is called when the user clicks the "Calculate Stats" button.
// The component uses the useState hook to manage the state of the input fields and the calculated stats.
// The handleCalculateStats function is called when the user clicks the "Calculate Stats" button.