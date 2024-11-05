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

3 通りの方法があります。どのやり方でも可能です。
終わったら、 `server/.env.dev` と `web/.env` をコピーしてきましょう。

1. The Original Way

- 以下をインストールします:

  - Bun (js)
  - GNU Make
  - nvm (optional)

- `make setup` を実行します。

2. The Nix Way

- Nix をインストールします
- `nix develop` を実行します。
  - 仮想依存環境が作成されます。
  - 開発を終わるときは、 `exit` を実行して Nix shell から出るようにしましょう。
- `make setup` を実行します。

3. Nix + Direnv

- Nix と nix-direnv をインストールします。
- `direnv allow` を実行します。
- `make setup` を実行します。

### 環境変数

ut.code(); Slack に参加し、環境変数をメンバーに聞きましょう。

### server、webの起動

```sh
make start
# または
make watch
# または
make docker
# または
make docker-watch
```

## Deploy

web:
```sh
NEXT_PUBLIC_ALLOW_ANY_MAIL_ADDR=true # optional
make prepare-deploy-web`
# serve ./web/dist
```

server:
```sh
make prepare-deploy-server
make deploy-server
```
