# FIDO2 Test Application with Ledger Nano X

このアプリケーションは、Ledger Nano XをFIDO2認証器として使用するためのテストアプリです。中身としてはパスキーの登録・検証アプリなので、webauthn.ioのようなサーバを気軽にローカルで構築できます。また、サーバに認証情報が保存されることはないのでサーバを再起動すれば何度でも登録→認証を試せます。

## デモ
githubアカウントでログイン済みの方はcodespacesを使ってアプリを試せます。リポジトリ右上のgithub pagesへのリンクから始められます。

## 機能

- FIDO2認証器（Ledger Nano X）の登録
- 登録済み認証器による認証
- 詳細なログ表示と分析機能
- FIDO2プロトコルの可視化
- インタラクティブなステップ表示

## 技術スタック

- Node.js
- Express.js
- [@simplewebauthn/server](https://www.npmjs.com/package/@simplewebauthn/server)
- [@simplewebauthn/browser](https://www.npmjs.com/package/@simplewebauthn/browser)

## 必要条件

- Node.js 14.0.0以上
- Ledger Nano X / yubikey / パスキーを発行可能なデバイス
- 最新のChrome、Firefox、またはEdgeブラウザ

## セットアップ

1. リポジトリのクローン:
```bash
git clone https://github.com/yourusername/fido2-test.git
cd fido2-test
```

2. 依存関係のインストール:
```bash
npm install
```

3. アプリケーションの起動:
```bash
npm run dev
```

4. ブラウザで以下のURLにアクセス:
```
http://localhost:3000
```

## Ledger Nano Xの準備

1. Ledger Nano XがUSBで接続されていることを確認
2. Ledger Live経由で最新のファームウェアに更新
3. FIDO2アプリケーションがインストールされていることを確認

## 使用方法

### 登録プロセス

1. Ledger Nano Xを接続
2. 「登録」ボタンをクリック
3. Ledger上でFIDO2アプリを起動
4. PINコードを入力
5. Ledger画面の指示に従って操作を確認

### 認証プロセス

1. 登録済みのLedger Nano Xを接続
2. 「認証」ボタンをクリック
3. Ledger上でFIDO2アプリを起動
4. PINコードを入力
5. Ledger画面の指示に従って操作を確認

## ログ機能

アプリケーションは以下の情報を詳細に記録します：

- FIDO2プロトコルの各ステップ
- WebAuthn APIとの対話
- 認証器からのレスポンス
- エラー情報とスタックトレース
- タイムスタンプ付きの操作ログ

ログは以下の形式で表示されます：
```
[TIMESTAMP] [LEVEL] Message
  Data: {
    // 詳細な技術情報
  }
```

## 教育・研究での利用

このアプリケーションは以下の学習項目に適しています：

- FIDO2プロトコルの理解
- WebAuthn APIの動作検証
- 認証フローの分析
- セキュリティ研究
- 実践的なデモンストレーション

## トラブルシューティング

### よくある問題

1. Ledgerが認識されない
   - USBケーブルの接続を確認
   - FIDO2アプリが起動しているか確認
   - ブラウザのWebAuthn対応を確認

2. 認証に失敗する
   - 正しいデバイスで登録を行ったか確認
   - PINコードが正しいか確認
   - Ledgerの画面指示を確認

3. ログが表示されない
   - ブラウザのコンソールでエラーを確認
   - ページのリロードを試す

## セキュリティ注意事項

- このアプリケーションはテスト・教育目的で作成されています
- 本番環境での使用は推奨されません
- セッション管理は簡易的な実装となっています
- 実際の運用では適切なセキュリティ対策が必要です

## ライセンス

MIT License

## 参考リンク

- [WebAuthn Guide](https://webauthn.guide/)
- [Ledger Documentation](https://developers.ledger.com/)
- [FIDO2 Specification](https://fidoalliance.org/specifications/) 