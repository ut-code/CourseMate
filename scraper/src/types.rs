use serde::Serialize;

#[derive(Serialize, Clone)]
pub struct Course {
    pub name: String,
    pub teacher: String,
    pub semester: String,
    pub period: String,
    pub code: String,
}
#[derive(Serialize, Clone)]
pub struct Entry {
    pub name: String,
    pub courses: Vec<Course>,
}
