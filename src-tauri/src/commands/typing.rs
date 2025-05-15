use lazy_static::lazy_static;
use rand::seq::IndexedRandom;
use std::collections::HashMap;
use tauri::State;

use crate::state::AppState;

// pre-defined texts
lazy_static! {
    static ref TEXTS: HashMap<&'static str, Vec<&'static str>> = {
        let mut m = HashMap::new();
        m.insert("quotes", vec![
            "The quick brown fox jumps over the lazy dog.",
            "To be or not to be, that is the question.",
            "Life is what happens when you're busy making other plans.",
            "The only limit to our realization of tomorrow is our doubts of today.",
            "In the end, we will remember not the words of our enemies, but the silence of our friends."
        ]);
        m.insert("code", vec![
            "fn main() { println!(\"Hello, world!\"); }",
            "let x = 42; let y = 3.14; let z = x + y;",
            "for i in 0..10 { println!(\"Number: {}\", i); }",
            "if x > y { println!(\"x is greater than y\"); } else { println!(\"y is greater than or equal to x\"); }",
            "let mut v = vec![1, 2, 3]; v.push(4); v.push(5);"
        ]);
        m.insert(
            "random",
            vec![
                "The sunset cast a golden glow across the calm water of the bay.",
                "She quickly typed the document while sipping her morning coffee.",
                "The ancient oak tree provided shade for generations of visitors.",
                "He assembled the new furniture following the detailed instructions.",
                "The museum exhibit featured artifacts from various historical periods.",
            ],
        );
        m
    };
}

#[tauri::command]
pub fn get_text_to_type(
    _state: State<std::sync::Arc<AppState>>,
    category: Option<String>,
    length: Option<String>,
) -> String {
    // default values
    let cat = category.unwrap_or_else(|| "quotes".to_string());
    let len = length.unwrap_or_else(|| "medium".to_string());

    // get requested text
    let samples = TEXTS
        .get(cat.as_str())
        .unwrap_or_else(|| TEXTS.get("quotes").unwrap());

    // use a rng
    let mut rng = rand::rng();
    let s = samples[..]
        .choose(&mut rng)
        .unwrap_or(&"The quick brown fox jumps over the lazy dog.");

    // update the length
    match len.as_str() {
        "short" => s[0..s.len().min(40)].to_string(),
        "long" => {
            // when long, repeat the text
            let mut result = s.to_string();
            while result.len() < 100 {
                result.push(' ');
                result.push_str(s);
            }
            result
        }
        _ => s.to_string(), // medium (default)
    }
}
