import React, { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import "../styles/TypingTest.css";
import Settings from "./Settings";

interface SessionStat {
    wpm: number;
    accuracy: number;
    timestamp: number;
    testMode: string;
    category: string;
    length: string;
    timeLimit?: number;
}

function TypingTest() {
    // setings
    const [category, setCategory] = useState("quotes");
    const [textLength, setTextLength] = useState("medium");
    const [testMode, setTestMode] = useState("standard");
    const [timeLimit, setTimeLimit] = useState(60); // seconds

    // test state
    const [textToType, setTextToType] = useState("Loading text...");
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [showSettings, setShowSettings] = useState(true);
    const [testComplete, setTestComplete] = useState(false);
    const [testActive, setTestActive] = useState(false);
    const [savedStats, setSavedStats] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<number | null>(null);

    // fetch some text from the backend
    useEffect(() => {
        async function fetchText() {
            try {
                const text = await invoke<string>("get_text_to_type", {
                    category,
                    length: textLength
                });
                setTextToType(text);
            } catch (error) {
                console.error("Error fetching text:", error);
            }
        }
        if (showSettings) {
            fetchText();
        }
    }, [category, textLength, showSettings]);

    // timer for timed mode
    useEffect(() => {
        if (testMode === "timed" && startTime && !endTime) {
            setTimeRemaining(timeLimit);

            timerRef.current = window.setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev === null || prev <= 1) {
                        // time's up!!!
                        clearInterval(timerRef.current!);
                        setEndTime(Date.now());
                        setTestComplete(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [startTime, endTime, testMode, timeLimit]);

    // save stats
    useEffect(() => {
        async function saveTestStats() {
            if (!testComplete || savedStats) return;

            const wpm = calculateWPM();
            const accuracy = calculateAccuracy();

            try {
                const stat: SessionStat = {
                    wpm,
                    accuracy,
                    timestamp: Date.now(),
                    testMode,
                    category,
                    length: textLength,
                };

                if (testMode === "timed") {
                    stat.timeLimit = timeLimit;
                }

                await invoke("save_stats", { newStat: stat });
                setSavedStats(true);
            } catch (error) {
                console.error("Error saving stats:", error);
            }
        }

        if (testComplete) {
            saveTestStats();
        }
    }, [testComplete, savedStats, category, textLength, testMode, timeLimit]);

    // focus the input field when the container is clicked
    const handleContainerClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        // start time
        if (input.length === 1 && userInput.length === 0) {
            setStartTime(Date.now());
            setShowSettings(false);
            setTestActive(true);
        }

        // end time when the input matches the text (for standard mode)
        if (testMode === "standard" && input === textToType) {
            setEndTime(Date.now());
            setTestComplete(true);
        }

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
        if (!startTime) return 0; // no typing yet

        const endTimeToUse = endTime || Date.now();
        const minutes = (endTimeToUse - startTime) / 60000; // ms to min

        if (minutes === 0) return 0;

        let textTyped = userInput;
        if (testMode === "timed" && !endTime) {
            // for ongoing timed tests, calculate based on what's typed so far
            textTyped = userInput;
        }

        const words = textTyped.length / 5; // assuming 5 chars per word
        return Math.round(words / minutes);
    }

    // get accuracy
    const calculateAccuracy = () => {
        if (userInput.length === 0) return 100;

        let correctChars = 0;
        let totalChars = userInput.length;

        for (let i = 0; i < totalChars; i++) {
            if (i < textToType.length && userInput[i] === textToType[i])
                correctChars++;
        }
        return Math.round((correctChars / userInput.length) * 100);
    };

    // reset test
    const resetTest = () => {
        if (timerRef.current) clearInterval(timerRef.current);


        setUserInput("");
        setStartTime(null);
        setEndTime(null);
        setTimeRemaining(null);
        setShowSettings(true);
        setTestComplete(false);
        setTestActive(false);
        setSavedStats(false);

        // refocus input
        if (inputRef.current) inputRef.current.focus();
    };

    // format time remaining
    const formatTimeRemaining = () => {
        if (timeRemaining === null) return "";

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="typing-test">
            <h2>Typing Test</h2>

            {showSettings && (
                <Settings
                    category={category}
                    setCategory={setCategory}
                    length={textLength}
                    setLength={setTextLength}
                    testMode={testMode}
                    setTestMode={setTestMode}
                    timeLimit={timeLimit}
                    setTimeLimit={setTimeLimit}
                />
            )}

            <div
                className={`typing-container ${testActive ? 'active' : ''} ${testComplete ? 'completed' : ''}`}
                onClick={handleContainerClick}
                ref={containerRef}
            >
                {testMode === "timed" && timeRemaining !== null && (
                    <div className="time-remaining">{formatTimeRemaining()}</div>
                )}

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
                    disabled={testComplete}
                />

                {userInput.length === 0 && !testComplete && (
                    <div className="start-prompt">
                        {showSettings ? "Click here and start typing" : "Start typing to begin the test"}
                    </div>
                )}
            </div>

            <div className="metrics-container">
                {(startTime || testComplete) && (
                    <div className="metrics">
                        <div className="metric-card">
                            <h3>WPM</h3>
                            <div className="metric-value">{calculateWPM()}</div>
                        </div>
                        <div className="metric-card">
                            <h3>Accuracy</h3>
                            <div className="metric-value">{calculateAccuracy()}%</div>
                        </div>
                        {testComplete && (
                            <div className="metric-card">
                                <h3>Time</h3>
                                <div className="metric-value">
                                    {testMode === "timed"
                                        ? `${timeLimit}s`
                                        : `${((endTime! - startTime!) / 1000).toFixed(1)}s`
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {(testComplete || (testMode === "timed" && timeRemaining === 0)) && (
                    <button className="reset-button" onClick={resetTest}>
                        New Test
                    </button>
                )}
            </div>
        </div>
    );
}

export default TypingTest;