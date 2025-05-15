import '../styles/Settings.css';

interface TestSettingsProps {
    category: string;
    setCategory: (category: string) => void;
    length: string;
    setLength: (length: string) => void;
    testMode: string;
    setTestMode: (mode: string) => void;
    timeLimit: number;
    setTimeLimit: (time: number) => void;
}

function Settings({
    category,
    setCategory,
    length,
    setLength,
    testMode,
    setTestMode,
    timeLimit,
    setTimeLimit
}: TestSettingsProps) {
    return (
        <div className="test-settings">
            <div className="settings-group">
                <label className="settings-label">Text Category:</label>
                <div className="settings-options">
                    <button
                        className={category === 'quotes' ? 'option-selected' : ''}
                        onClick={() => setCategory('quotes')}
                    >
                        Quotes
                    </button>
                    <button
                        className={category === 'code' ? 'option-selected' : ''}
                        onClick={() => setCategory('code')}
                    >
                        Code
                    </button>
                    <button
                        className={category === 'random' ? 'option-selected' : ''}
                        onClick={() => setCategory('random')}
                    >
                        Random
                    </button>
                </div>
            </div>

            <div className="settings-group">
                <label className="settings-label">Text Length:</label>
                <div className="settings-options">
                    <button
                        className={length === 'short' ? 'option-selected' : ''}
                        onClick={() => setLength('short')}
                    >
                        Short
                    </button>
                    <button
                        className={length === 'medium' ? 'option-selected' : ''}
                        onClick={() => setLength('medium')}
                    >
                        Medium
                    </button>
                    <button
                        className={length === 'long' ? 'option-selected' : ''}
                        onClick={() => setLength('long')}
                    >
                        Long
                    </button>
                </div>
            </div>

            <div className="settings-group">
                <label className="settings-label">Test Mode:</label>
                <div className="settings-options">
                    <button
                        className={testMode === 'standard' ? 'option-selected' : ''}
                        onClick={() => setTestMode('standard')}
                    >
                        Standard
                    </button>
                    <button
                        className={testMode === 'timed' ? 'option-selected' : ''}
                        onClick={() => setTestMode('timed')}
                    >
                        Timed
                    </button>
                </div>
            </div>

            {testMode === 'timed' && (
                <div className="settings-group">
                    <label className="settings-label">Time Limit:</label>
                    <div className="settings-options">
                        <button
                            className={timeLimit === 15 ? 'option-selected' : ''}
                            onClick={() => setTimeLimit(15)}
                        >
                            15s
                        </button>
                        <button
                            className={timeLimit === 30 ? 'option-selected' : ''}
                            onClick={() => setTimeLimit(30)}
                        >
                            30s
                        </button>
                        <button
                            className={timeLimit === 60 ? 'option-selected' : ''}
                            onClick={() => setTimeLimit(60)}
                        >
                            1m
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;