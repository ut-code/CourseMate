use crate::types::*;
use anyhow::ensure;
use sha2::{Digest, Sha256};
use tokio::fs;
use tokio::io::AsyncWriteExt;

pub async fn write_to(file: &mut fs::File, content: Entry) -> anyhow::Result<()> {
    let s = serde_json::to_string(&content)?;
    file.write_all(s.as_bytes()).await?;
    Ok(())
}

const CACHE_DIR: &str = "./.cache";

pub async fn request(url: &str) -> anyhow::Result<String> {
    println!("[request] sending request to {}", url);

    let hash = Sha256::digest(url.as_bytes());
    let path = format!("{CACHE_DIR}/{:x}", hash);
    match tokio::fs::read(&path).await {
        Ok(cont) => return Ok(String::from_utf8(cont)?),
        Err(_) => {
            // continue
        }
    }
    let res = reqwest::get(url).await?;
    ensure!(
        200 <= res.status().as_u16() && res.status().as_u16() < 300,
        "Status check failed: expected 200~299, got {}",
        res.status()
    );
    let text = res.text().await?;
    let mut f = tokio::fs::File::create(path).await?;
    f.write_all(text.as_bytes()).await?;
    Ok(text)
}
