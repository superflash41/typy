// use tauri::State;

// use crate::{
//     models::session::SessionStat,
//     state::AppState
// };

#[tauri::command]
pub fn calculate_wpm(chars_typed: usize, time_seconds: f64) -> f64 {
    // formula: WPM = (chars_typed / 5) / (time_seconds / 60)
    let words_typed = chars_typed as f64 / 5.0;
    let minutes = time_seconds / 60.0;
    if minutes == 0.0 {
        return 0.0;
    }
    words_typed / minutes
}

#[tauri::command]
pub fn calculate_accuracy(correct_chars: usize, total_chars: usize) -> f64 {
    if total_chars == 0 {
        return 0.0;
    }
    (correct_chars as f64 / total_chars as f64) * 100.0
}
