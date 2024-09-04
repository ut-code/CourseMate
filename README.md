# CourseMate

## 概要

学内で友達が欲しい人同士をマッチングするアプリ

## 開発

### Makefile

GNU Make が導入されています。以下は、ユーザーが使うことが想定されているコマンドの一部です。

- make setup (セットアップします。)
- make start (build -> serve します。)
- make watch (ホットリロードします。)
- make precommit (type-check, format-check, lint を実行します。husky で自動実行されます。)

### 環境構築

1. The Nix Way

- Nix と nix-direnv をインストールします。
- `direnv allow` を実行します。
  他は勝手についてきます。

2. The Original Way

- install:

  - Node.js v22
  - Node Package Manager / npm
  - nvm (optional)
  - GNU Make (optional)

- run:
  ```sh
  make setup
  ```

終わったら、 `server/.env` と `web/.env` をコピーしてきましょう。

### 環境変数

- `mobile`
- `web`
- `server`
  - `DATABASE_URL` : `postgresql://janedoe:mypassword@localhost:5432/mydb?schema=sample` の形式

### server、webの起動

```sh
make start
# または
make watch
# または
make docker
```
