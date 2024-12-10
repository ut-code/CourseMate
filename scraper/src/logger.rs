pub struct Logger {
    limit: usize,
    current: usize,
    start_ms: i64,
    start_sec: i64,
    start_min: i64,
}

impl Logger {
    pub fn new(limit: usize) -> Self {
        let start_ms = chrono::Local::now().timestamp_millis();
        let start_sec = chrono::Local::now().timestamp();
        let start_min = chrono::Local::now().timestamp() / 60;
        Logger {
            current: 0,
            limit,
            start_ms,
            start_sec,
            start_min,
        }
    }
    pub fn done(&mut self, name: &str) {
        let now_ms = chrono::Local::now().timestamp_millis();
        let now_sec = chrono::Local::now().timestamp();
        let now_min = now_sec / 60;
        self.current += 1;
        let count = self.current;
        println!(
            "[log] faculty {name} done. ({count} / {}) timestamp: {}ms / {}sec / {}min",
            self.limit,
            now_ms - self.start_ms,
            now_sec - self.start_sec,
            now_min - self.start_min,
        );
    }
    pub fn close(self) -> Result<(), ()> {
        if self.limit == self.current {
            Ok(())
        } else {
            Err(())
        }
    }
}
