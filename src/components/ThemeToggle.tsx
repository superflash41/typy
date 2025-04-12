import React, { useEffect, useState } from 'react';
import '../styles/ThemeToggle.css';

function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // apply theme when component mounts or theme changes
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <button
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDarkMode ? '☀️' : '🌙'}
        </button>
    );
}

export default ThemeToggle;