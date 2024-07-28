# CourseMate

## 概要

学内で友達が欲しい人同士をマッチングするアプリ

## 開発

### 環境変数

- `mobile`
- `web`
- `server`
  - `DATABASE_URL` : `postgresql://janedoe:mypassword@localhost:5432/mydb?schema=sample` の形式

## Makefile

GNU Make が導入されています。以下は、ユーザーが使うことが想定されているコマンドの一部です。

- make setup (セットアップします。)
- make start (build -> serve します。)
- make watch (ホットリロードします。)
- make precommit (type-check, format-check, lint を実行します。husky で自動実行されます。)

## 環境構築

```sh
make setup
```

終わったら、 `server/.env` と `web/.env` をコピーしてきましょう。

## server、webの起動

```sh
make start
# または
make watch
# または
make docker
```
