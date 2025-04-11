use tauri::State;

use crate::state::AppState;

#[tauri::command]
pub fn get_text_to_type(_state: State<std::sync::Arc<AppState>>) -> String {
    // example text to type
    "The quick brown fox jumps over the lazy dog".into()
}
