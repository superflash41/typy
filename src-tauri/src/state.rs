use std::{sync::Mutex, vec};

use crate::models::{session::SessionStat, settings::Settings};

#[derive(Debug)]
#[allow(dead_code)]
pub struct AppState {
    pub settings: Mutex<Settings>,
    /// A vector to hold session statistics.
    pub session_stats: Mutex<Vec<SessionStat>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            settings: Mutex::new(Settings::default()),
            session_stats: Mutex::new(vec![]),
        }
    }
}
