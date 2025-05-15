import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import '../styles/StatsHistory.css';

interface SessionStat {
    wpm: number;
    accuracy: number;
    timestamp: number;
    testMode?: string;
    category?: string;
    length?: string;
    timeLimit?: number;
}

function StatsHistory() {
    const [stats, setStats] = useState<SessionStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStats() {
            try {
                setLoading(true);
                const result = await invoke<SessionStat[]>('load_stats');
                // Sort by timestamp, newest first
                const sortedStats = [...result].sort((a, b) => b.timestamp - a.timestamp);
                setStats(sortedStats);
                setError(null);
            } catch (error) {
                console.error('Failed to load stats:', error);
                setError('Failed to load your typing history');
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    if (loading) {
        return <div className="stats-history loading">Loading your typing history...</div>;
    }

    if (error) {
        return <div className="stats-history error">{error}</div>;
    }

    if (stats.length === 0) {
        return <div className="stats-history empty">You haven't completed any tests yet.</div>;
    }

    return (
        <div className="stats-history">
            <h2>Your Typing History</h2>

            <div className="stats-history-grid">
                <div className="stats-header">
                    <div>Date</div>
                    <div>WPM</div>
                    <div>Accuracy</div>
                    <div>Details</div>
                </div>

                {stats.map((stat, index) => (
                    <div key={index} className="stat-row">
                        <div>{formatDate(stat.timestamp)}</div>
                        <div className="wpm">{stat.wpm.toFixed(1)}</div>
                        <div className="accuracy">{stat.accuracy.toFixed(1)}%</div>
                        <div className="details">
                            {stat.category && <span className="tag">{stat.category}</span>}
                            {stat.length && <span className="tag">{stat.length}</span>}
                            {stat.testMode && <span className="tag">{stat.testMode}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatsHistory;