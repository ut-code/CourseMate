# 後期課程の授業をスクレイピングするスクリプト

https://catalog.he.u-tokyo.ac.jp/result にある授業情報を取得するスクリプトです。

## Quick Start

以下のコマンドを実行すると、 `data.json` に授業情報がjson形式で保存されます。

```bash
cd /path/to/this/dir
cargo run --release
```

## Maintaining

### Add faculty

ページに移動したときに、左側に学科を選ぶとhttps://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=1のようになります。
faculty_idが学科のIDです。
urls.rsのUrlsに学部の名前とその url の tuple を追加してください。
すでに全ての学科のIDが入っているので、特に追加するような状況にならない限りは変更する必要はありません。

### Extending code

コード中に .unwrap() が多くあると思います。これは意図的です。
