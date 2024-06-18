# CourseMate

## 概要

学内で友達が欲しい人同士をマッチングするアプリ

## 開発

### 環境変数

* `mobile`
* `server`
  * `DATABASE_URL` : `postgresql://janedoe:mypassword@localhost:5432/mydb?schema=sample` の形式

### 環境構築

プロジェクトルート・`mobile`・`server` の各ディレクトリで次のコマンドを実行してください

```shell
npm ci
```

### `mobile`

次のコマンドで開発環境が起動します（Web）

```shell
npm run web
```

### `server`

次のコマンドで開発環境が起動します

```shell
npm run dev
```
