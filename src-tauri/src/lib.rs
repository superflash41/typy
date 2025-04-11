// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use std::sync::Arc;

mod commands;
mod models;
mod state;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // we use an instance of the shared app state
    let app_st = state::AppState::default();
    let app_st_arc = Arc::new(app_st);

    // create the tauri app
    tauri::Builder::default()
        .manage(app_st_arc) // so commands can access it
        .invoke_handler(tauri::generate_handler![
            commands::typing::get_text_to_type,
            commands::stats::calculate_wpm,
            commands::stats::calculate_accuracy,
            commands::storage::save_stats,
            commands::storage::load_stats,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
