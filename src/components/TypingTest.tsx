import React, { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../styles/TypingTest.css";

function TypingTest() {
    const [textToType, setTextToType] = useState("Loading text...");
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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
    }, []);

    // focus the input field when the container is clicked
    const handleContainerClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setUserInput(input);
        // start time on first keystroke
        if (input.length === 1 && userInput.length === 0) setStartTime(Date.now());
        // end time when the input matches the text
        if (input === textToType) setEndTime(Date.now());

        setUserInput(input);
    }

    // render text char-by-char styling
    const renderText = () => {
        return textToType.split("").map((char, index) => {
            let className = "character";

            if (index < userInput.length) {
                className += userInput[index] === char ? " correct" : " incorrect";
            } else if (index === userInput.length) {
                className += " current";
            } else {
                className += " upcoming";
            }

            if (char === " ") {
                return (
                    <span key={index} className={className}>
                        &nbsp;
                    </span>
                );
            }

            return (
                <span key={index} className={className}>
                    {char}
                </span>
            );
        });
    }

    // get the wpm
    const calculateWPM = () => {
        if (!startTime || !endTime) return 0;
        const minutes = (endTime - startTime) / 60000; // ms to min
        const words = textToType.length / 5; // assuming 5 chars per word
        return Math.round(words / minutes);
    }

    // get accuracy
    const calculateAccuracy = () => {
        if (userInput.length === 0) return 100;

        let correctChars = 0;
        for (let i = 0; i < userInput.length; i++) {
            if (i < textToType.length && userInput[i] === textToType[i]) correctChars++;
        }
        return Math.round((correctChars / userInput.length) * 100);
    };

    // reset test
    const resetTest = () => {
        setUserInput("");
        setStartTime(null);
        setEndTime(null);
        if (inputRef.current) inputRef.current.focus();
    };

    return (
        <div className="typing-test">
            <h2>Typing Test</h2>

            <div
                className="typing-container"
                onClick={handleContainerClick}
                ref={containerRef}
            >
                <div className="typing-display">
                    {renderText()}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleChange}
                    className="typing-input"
                    autoFocus
                />
                {userInput.length === 0 && (
                    <div className="start-prompt">Click here and start typing</div>
                )}
            </div>

            <div className="metrics-container">
                {startTime && (
                    <div className="metrics">
                        <div className="metric-card">
                            <h3>WPM</h3>
                            <div className="metric-value">{endTime ? calculateWPM() : "..."}</div>
                        </div>
                        <div className="metric-card">
                            <h3>Accuracy</h3>
                            <div className="metric-value">{calculateAccuracy()}%</div>
                        </div>
                    </div>
                )}

                {endTime && (
                    <button className="reset-button" onClick={resetTest}>
                        New Test
                    </button>
                )}
            </div>
        </div>
    );
}

export default TypingTest;
// This component fetches some text from the backend and displays it in a blockquote.
// It also has an input field where the user can type the text. The input is controlled by React state.
// The text is fetched using the Tauri API, and the component handles any errors that may occur during the fetch.
// The component uses the useEffect hook to fetch the text when it mounts.
// The handleChange function updates the userInput state whenever the input field changes.