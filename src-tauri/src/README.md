
## 🎯 Core Features for v1.0

1 Quote/text generation
- Return a string (or array of words) to type.
- Can be random quotes, words, or predefined texts.

2 Timing and performance
- Start and stop the timer.
- Calculate WPM, accuracy, characters typed, etc.

3 Stats persistence
- Save results locally (maybe to a JSON file or local DB).
- Retrieve and display past session stats.

4 Settings management
- Store user settings (theme, font, difficulty, etc).

## Folder Structure v1.0
The structure of the `src-tauri/src` folder:

```bash
src-tauri/
└── src/
    ├── main.rs
    ├── commands/             # IPC exposed functions
    │   ├── mod.rs
    │   ├── typing.rs         # core typing logic
    │   ├── stats.rs          # WPM, accuracy, etc
    │   ├── storage.rs        # save/load settings/stats
    │   └── config.rs         # app config management
    ├── models/               # Shared types/structs
    │   ├── mod.rs
    │   ├── session.rs        # typing session data
    │   └── settings.rs       # user settings data
    ├── utils/                # helper functions
    │   ├── mod.rs
    │   └── timer.rs          # timer logic
    └── state.rs             # shared app state (Mutex/Arc)
```

## 🧩 Backend Function Ideas
A sketch of what each command might expose via invoke from the frontend.

### `typing.rs`
- `get_text_to_type()`: Returns a string or list of words.
- You can preload texts from JSON or generate randomly.

### `stats.rs`
- `calculate_wpm(characters_typed, duration)`
- `calculate_accuracy(correct_chars, total_chars)`

### `storage.rs`
- `save_stats(stats_obj)`
- `load_stats()`
- `save_settings(settings_obj)`
- `load_settings()`

### `config.rs`
Load from a typy_config.json in AppData or similar path using tauri::api::path.