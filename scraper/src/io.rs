use crate::types::*;
use anyhow::ensure;
use tokio::fs;
use tokio::io::AsyncWriteExt;

pub async fn write_to(file: &mut fs::File, content: Entry) -> anyhow::Result<()> {
    let s = serde_json::to_string(&content)?;
    file.write_all(s.as_bytes()).await?;
    Ok(())
}

use crate::cache_dir;

pub async fn request(url: &str) -> anyhow::Result<String> {
    println!("[request] sending request to {}", url);

    let cache_key = url
        .to_string()
        .replacen("/", "_", 1000)
        .replacen(":", "_", 1000)
        .replacen("?", "_", 1000)
        .replacen("&", "_", 1000)
        .replacen("=", "_", 1000)
        .to_string();
    let path = format!("{}/{cache_key}", cache_dir());
    if let Ok(bytes) = fs::read(&path).await {
        if let Ok(text) = String::from_utf8(bytes) {
            return Ok(text);
        }
    }
    let res = reqwest::get(url).await?;
    let status = res.status().as_u16();
    ensure!(
        (200..=299).contains(&status),
        "Status check failed: expected 200~299, got {}",
        status
    );
    let text = res.text().await?;
    let mut f = tokio::fs::File::create(path).await?;
    f.write_all(text.as_bytes()).await?;
    Ok(text)
}
