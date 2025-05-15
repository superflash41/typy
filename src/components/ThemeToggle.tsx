import { useEffect, useState } from 'react';
import '../styles/ThemeToggle.css';

const THEMES = ['light', 'dark', 'purple'];
const FONT_SIZES = [12, 14, 16, 18, 20];

function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        // check for saved preference or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && THEMES.includes(savedTheme)) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const [fontSize, setFontSize] = useState(() => {
        const savedSize = localStorage.getItem('fontSize');
        return savedSize ? parseInt(savedSize) : 14;
    });

    const [showSettings, setShowSettings] = useState(false);

    // apply theme when component mounts or theme changes
    useEffect(() => {
        // remove old theme classes
        document.documentElement.classList.remove(...THEMES.map(t => `${t}-theme`));

        // add new theme class
        document.documentElement.classList.add(`${theme}-theme`);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // also apply the font size
    useEffect(() => {
        document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
        localStorage.setItem('fontSize', fontSize.toString());
    }, [fontSize]);

    const themeEmoji = {
        'light': '☀️',
        'dark': '🌙',
        'purple': '🔮'
    };

    // const cycleTheme = () => {
    //     const currentIndex = THEMES.indexOf(theme);
    //     const nextIndex = (currentIndex + 1) % THEMES.length;
    //     setTheme(THEMES[nextIndex]);
    // };

    return (
        <div className="theme-toggle-container">
            <button
                className="theme-toggle"
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Toggle appearance settings"
            >
                {themeEmoji[theme as keyof typeof themeEmoji]}
            </button>

            {showSettings && (
                <div className="theme-settings">
                    <div className="settings-section">
                        <span className="settings-label">Theme</span>
                        <div className="theme-options">
                            {THEMES.map((t) => (
                                <button
                                    key={t}
                                    className={`theme-option ${theme === t ? 'active' : ''}`}
                                    onClick={() => setTheme(t)}
                                >
                                    <span className={`theme-preview ${t}`}></span>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="settings-section">
                        <span className="settings-label">Font Size</span>
                        <div className="font-size-slider">
                            <button
                                className="size-btn"
                                onClick={() => setFontSize(prev => Math.max(FONT_SIZES[0], prev - 2))}
                            >
                                A-
                            </button>
                            <div className="size-value">{fontSize}px</div>
                            <button
                                className="size-btn"
                                onClick={() => setFontSize(prev => Math.min(FONT_SIZES[FONT_SIZES.length - 1], prev + 2))}
                            >
                                A+
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ThemeToggle;