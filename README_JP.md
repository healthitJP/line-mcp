# LINE MCP サーバー

**[English](README.md)** | **日本語**

[![npm version](https://badge.fury.io/js/line-mcp.svg)](https://www.npmjs.com/package/line-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AI アシスタント統合のためのLINE メッセージング用 Model Context Protocol (MCP) サーバー

## 概要

LINE MCP サーバーは、LINEメッセージングサービスとAIアシスタント（Claude Desktopなど）を統合するためのModel Context Protocolサーバーです。AIアシスタントがLINEアカウントを通じて認証、連絡先管理、メッセージ送信を行うことができます。

## 主な機能

- **LINEログイン**: コマンドライン引数を使用したLINE認証
- **連絡先管理**: 検索とトークン最適化機能付きの連絡先取得
- **メッセージ送信**: LINE ユーザーへのメッセージ送信（MID指定）
- **スマート検索**: トークン制限によるレスポンス最適化
- **ログイン状態管理**: 認証状態とエラーハンドリング

## 対象ユーザー

### 一般ユーザー向け
Claude DesktopでLINEメッセージング機能を使いたい方に最適です。AIアシスタントが以下のことを支援できます：

- LINE連絡先の検索と管理
- 特定の人へのメッセージ送信
- 連絡先情報の取得と整理

### AIアシスタントユーザー向け
このサーバーにより、AIアシスタントは以下のことが可能になります：

- LINEアカウントへのログイン
- 連絡先リストの検索・フィルタリング
- 指定した相手へのメッセージ送信
- ログイン状態の確認と管理

## 技術仕様

### ツール一覧

#### 1. `login`
**説明**: コマンドライン引数を使用してLINEにログインします

**パラメータ**: なし

#### 2. `get_contacts`
**説明**: 連絡先を取得します。オプションで検索フィルターとトークン制限が可能です

**パラメータ**:
- `search` (オプション, string): 連絡先名での検索フィルター
- `maxTokens` (オプション, number): レスポンスのトークン制限

#### 3. `send_message`
**説明**: 指定したユーザーにメッセージを送信します

**パラメータ**:
- `to` (必須, string): 受信者のMID
- `message` (必須, string): 送信するメッセージ

## セットアップ

### コマンドライン引数

LINE MCPサーバーは3つのコマンドライン引数が必要です：

1. **EMAIL**: LINEアカウントのメールアドレス
2. **PASSWORD**: LINEアカウントのパスワード
3. **STORAGE_PATH**: 認証トークンが保存されるディレクトリパス

**構文**: `npx line-mcp <email> <password> <storage_path>`

**例**: `npx line-mcp user@example.com mypassword ./line_storage`

**重要**: ストレージディレクトリはサーバー開始前に存在している必要があります。指定されたパスが存在しないかアクセスできない場合、サーバーの起動が失敗します。

### Claude Desktop での設定

`claude_desktop_config.json` ファイルに以下の設定を追加してください：

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### 基本設定

```json
{
  "mcpServers": {
    "line-mcp": {
      "command": "npx",
      "args": ["line-mcp", "your_line_email@example.com", "your_line_password", "/path/to/storage/directory"]
    }
  }
}
```

#### ワーキングディレクトリを指定した詳細設定

MCPサーバーのワーキングディレクトリ（`cwd`）を指定することもできます。これは相対パスを使用する場合や、サーバーの動作の基準となる特定のディレクトリを設定したい場合に便利です：

```json
{
  "mcpServers": {
    "line-mcp": {
      "command": "npx",
      "args": [
        "line-mcp@latest",
        "your_line_email@example.com", 
        "your_line_password",
        "./line_auth_storage"
      ],
      "cwd": "/path/to/your/project/directory"
    }
  }
}
```

**設定オプション**:
- `command`: 実行するコマンド（通常は `npx`）
- `args`: パッケージ名、メールアドレス、パスワード、ストレージパスを含むコマンドライン引数の配列
- `cwd`（オプション）: MCPサーバー実行時のワーキングディレクトリ。指定した場合、引数内の相対パスはこのディレクトリを基準として解決されます。

**重要**: 
- `your_line_email@example.com` と `your_line_password` を実際のLINEアカウントの認証情報に置き換えてください。
- ストレージパスを認証トークンが保存されるディレクトリまたはファイルのパスに置き換えてください。
- **ストレージディレクトリが存在している必要があります**: 指定されたストレージパスが存在しない場合、サーバーはエラーで起動に失敗します。
- `cwd`を使用する場合、ストレージパスに `./line_auth_storage` のような相対パスを使用できます。これは指定されたワーキングディレクトリを基準として解決されます。

## 依存関係

主要な依存関係：
- `@evex/linejs`: LINEクライアントライブラリ
- `@modelcontextprotocol/sdk`: MCPサーバー開発キット
- `tiktoken`: トークンカウンティング
- `zod`: スキーマ検証
- `dotenv`: 環境変数管理

## セキュリティに関する考慮事項

### アクセス制御
- このサーバーはLINEアカウントへの完全なアクセスを提供します
- 信頼できる環境でのみ使用してください
- 定期的にLINEアカウントのログイン履歴を確認してください

## トラブルシューティング

### よくある問題

#### 1. ログインできない
**症状**: `login`ツールでエラーが発生
**解決方法**:
- Claude Desktop設定でコマンドライン引数（メールアドレスとパスワード）が正しく設定されているか確認
- LINEアカウントが有効で、正しい認証情報を使用しているか確認
- 2段階認証が有効な場合は、アプリパスワードの使用を検討

#### 2. 連絡先が取得できない
**症状**: `get_contacts`ツールが空の結果を返す
**解決方法**:
- ログイン状態を確認し、ログインしていない場合は`login`ツールを実行
- LINEアプリで連絡先が同期されているか確認

#### 3. メッセージが送信できない
**症状**: `send_message`ツールでエラーが発生
**解決方法**:
- 受信者のMIDが正しいか確認（`get_contacts`で取得可能）
- ログイン状態を確認
- LINEアカウントがメッセージ送信制限を受けていないか確認

#### 4. サーバーの起動に失敗する
**症状**: サーバーの初期化または起動に失敗する
**解決方法**:
- ストレージディレクトリパスが存在し、アクセス可能であることを確認
- ディレクトリのアクセス権限を確認（読み書きアクセスが必要）
- Claude Desktop設定で3つのコマンドライン引数がすべて正しく指定されていることを確認
- ストレージディレクトリが存在しない場合は手動で作成

## 制限事項

- 現在、テキストメッセージの送信のみサポート（画像、ファイル等は未対応）
- グループチャット機能は未実装
- LINEの利用規約とAPI制限に従って使用してください

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

## サポート

問題が発生した場合は、以下を確認してください：
1. Claude Desktop でのコマンドライン引数設定
2. LINEアカウントの状態
3. ネットワーク接続
4. Claude Desktop の設定

追加のサポートが必要な場合は、イシューを作成してください。
