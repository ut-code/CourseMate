# CourseMate

## 概要

学内で友達が欲しい人同士をマッチングするアプリ

## 開発

### 環境変数

* `front`
* `back`
  * `DATABASE_URL` : `postgresql://janedoe:mypassword@localhost:5432/mydb?schema=sample` の形式

### 環境構築

プロジェクトルート・`front`・`back` の各ディレクトリで次のコマンドを実行してください

```shell
npm ci
```

### フロントエンド

次のコマンドで開発環境が起動します（Web）

```shell
npm run web
```

### バックエンド

次のコマンドで開発環境が起動します

```shell
npm run dev
```
