# 後期課程の授業をスクレイピングするスクリプト

## 1. Quick Start
`https://catalog.he.u-tokyo.ac.jp/result` にある授業情報を取得するスクリプトです。
以下のコマンドを実行すると、./kouki.jsonに授業情報が保存されます。

```bash
cd ~/CourseMate/scraper
go run .
```

## Output

JSON のスキーマ:
```json file=kouki.json
[
  {
    faculity: "学部の名前",
    courses: [
      {
        name: "授業の名前",
        teacher: "教授の名前",
        semester: "セメスター",
        period: "時限 (例: 水曜4限)",
        code: "授業コード"
      }
    ]
  }
]
```

## Maintaining this script
ページに移動したときに、左側に学科を選ぶと `https://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=1` のようになります。 `faculty_id` が学科のIDです。
`main.go` の `urls` に学部とその `url` を追加してください。すでに全ての学科のIDが入っているので、特に追加するような状況にならない限りは変更する必要はありません。
