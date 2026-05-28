# Supira AI Career OS

人材会社向けのキャリアアドバイザー（CA）業務支援 Web アプリです。

## 機能（MVP）

- **学生カルテ** — 基本情報・面談履歴・ES/ガクチカ・面接状況・メモ
- **AI 面談要約** — 音声アップロード → Whisper 文字起こし → OpenAI 分析
- **温度感管理** — 高/中/低/離脱リスク、危険通知
- **ダッシュボード** — KPI、通知、最近の学生

## 技術スタック

- Next.js (App Router) + TypeScript + Tailwind CSS
- Firebase Firestore / Auth / Storage（Phase B）
- OpenAI API + Whisper API
- Vercel デプロイ想定

## クイックスタート（モックモード）

```bash
cp .env.example .env.local
npm install
npm run dev
```

ブラウザで **http://localhost:3000** を開きます。

### 開けないとき

1. ポート競合を解消して起動:
   ```bash
   ./scripts/dev.sh
   ```
2. 別ターミナルでポート確認: `lsof -i :3000`
3. 古い `next dev` が残っていたら: `pkill -f "next dev"` のあと再実行
4. URL は `http://localhost:3000` または `http://127.0.0.1:3000`（`https` ではない）

モックモードでは Firebase 不要で、サンプルデータ 10 名が読み込まれます。  
AI 解析は `OPENAI_API_KEY` 未設定時、自動的にモック結果を返します。

## 環境変数

| 変数 | 説明 |
|------|------|
| `NEXT_PUBLIC_DATA_SOURCE` | `mock`（既定）または `firebase` |
| `DEV_MOCK_AI` | `true` で OpenAI 未使用時もモック AI |
| `SKIP_AUTH` | `true` で認証スキップ（モック推奨） |
| `OPENAI_API_KEY` | OpenAI API キー |

## OpenAI を使う場合

`.env.local` に以下を設定:

```bash
OPENAI_API_KEY=sk-...
DEV_MOCK_AI=false
```

面談アップロード画面から音声ファイル（最大 25MB）を送信すると、Whisper → GPT-4o-mini で解析します。

## Firebase 接続（Phase B）

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクト作成
2. Authentication で Email/Password を有効化
3. Firestore / Storage を有効化
4. サービスアカウントキーを取得
5. `.env.local` を更新:

```bash
NEXT_PUBLIC_DATA_SOURCE=firebase
SKIP_AUTH=false
# Firebase Web + Admin 設定...
```

6. ルールをデプロイ:

```bash
firebase deploy --only firestore:rules,storage
```

7. シードデータ投入:

```bash
npx tsx firebase/seed.ts
```

## Vercel デプロイ

1. GitHub にプッシュ
2. Vercel でインポート
3. 環境変数を設定（`.env.example` 参照）
4. デプロイ

## 画面構成

| パス | 内容 |
|------|------|
| `/` | ダッシュボード |
| `/students/[id]` | 学生詳細（3カラム） |
| `/interviews/upload` | 面談アップロード |
| `/login` | CA ログイン |

## データについて（モック）

モックデータはサーバーインメモリに保持されます。**開発サーバー再起動でリセット**されます。

## ライセンス

Private — Supira
