#[derive(Debug, Clone)]
pub struct Settings {
    pub theme: String,
    pub font_size: u8,
    // add more if needed
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            theme: "light".to_string(),
            font_size: 14,
        }
    }
}
