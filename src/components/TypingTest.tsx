import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

function TypingTest() {
    const [textToType, setTextToType] = useState("Loading text...");
    const [userInput, setUserInput] = useState("");

    // we fetch some text from the backend
    useEffect(() => {
        async function fetchText() {
            try {
                const text = await invoke<string>("get_text_to_type");
                setTextToType(text);
            } catch (error) {
                console.error("Error fetching text:", error);
            }
        }

        fetchText();
    }
        , []);

    // now the placeholder for a typing test
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    }

    return (
        <div style={{ marginTop: '1rem' }}>
            <h2>Typing Test</h2>
            <p>Text to type:</p>
            <blockquote>
                {textToType}
            </blockquote>

            <input
                type="text"
                value={userInput}
                onChange={handleChange}
                placeholder="Type here..."
            />
        </div>
    )
}

export default TypingTest;
// This component fetches some text from the backend and displays it in a blockquote.
// It also has an input field where the user can type the text. The input is controlled by React state.
// The text is fetched using the Tauri API, and the component handles any errors that may occur during the fetch.
// The component uses the useEffect hook to fetch the text when it mounts.
// The handleChange function updates the userInput state whenever the input field changes.