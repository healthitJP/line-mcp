# LINE MCP

LINE API を使用した MCP サーバー

## セットアップ

1. 依存関係をインストールします：
```bash
npm install
```

2. `.env` ファイルを作成し、LINE認証情報を設定します：
```
LINE_EMAIL=your.line.email@gmail.com
LINE_PASSWORD=your_line_password
```

3. 実行します：
```bash
npm start
```

## 環境変数

以下の環境変数が必要です：

- `LINE_EMAIL`: LINEアカウントのメールアドレス
- `LINE_PASSWORD`: LINEアカウントのパスワード

## 注意事項

- LINE認証にはピンコードの入力が必要な場合があります
- 認証情報は適切に管理してください
