use tauri::State;

use crate::{models::session::SessionStat, state::AppState};

#[tauri::command]
pub fn save_stats(
    state: State<std::sync::Arc<AppState>>,
    new_stat: SessionStat,
) -> Result<(), String> {
    let mut stats = state.session_stats.lock().map_err(|e| e.to_string())?;
    stats.push(new_stat);
    // Later, you might persist to disk or DB here.
    Ok(())
}

#[tauri::command]
pub fn load_stats(state: State<std::sync::Arc<AppState>>) -> Result<Vec<SessionStat>, String> {
    let stats = state.session_stats.lock().map_err(|e| e.to_string())?;
    Ok(stats.clone()) // returns a copy. SessionStat needs Clone.
}
