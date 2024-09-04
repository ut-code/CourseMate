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
終わったら、 `server/.env` と `web/.env` をコピーしてきましょう。

1. The Nix Way

- Nix と nix-direnv をインストールします。
- `direnv allow` を実行します。
  他は勝手についてきます。

2. The Nix Way (but no direnv)

- Nix をインストールします
- `nix develop` を実行します。
  - 仮想依存環境が作成されます。
- 開発を終わるときは、 `exit` を実行して Nix shell から出るようにしましょう。

3. The Original Way

- install:

  - Node.js v22
  - Node Package Manager / npm
  - nvm (optional)
  - GNU Make (optional)

- run:
  ```sh
  make setup
  ```

### 環境変数

ut.code(); Slack に参加し、環境変数をメンバーに聞きましょう。

### server、webの起動

```sh
make start
# または
make watch
# または
make docker
```
