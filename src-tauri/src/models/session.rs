use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionStat {
    pub wpm: f64,
    pub accuracy: f64,
    pub timestamp: i64, // e.g. a unix timestamp
                        // add more fields if needed
}
