---
name: deploy
description: コードの変更をコミットし、GitHubにプッシュした後、Vercelに本番デプロイする。「デプロイして」「サイトを更新して」「公開して」と言われたときに使う。
argument-hint: [コミットメッセージ]
allowed-tools: Bash, Read, Grep, Glob
---

# サイト更新・デプロイ手順

以下の手順でサイトを更新してください。

## 1. 変更内容の確認

```bash
git -C /Users/shihoffici4l/tokuyou-web status
git -C /Users/shihoffici4l/tokuyou-web diff
```

変更がない場合は「変更がありません」と伝えて終了してください。

## 2. ビルドチェック

デプロイ前に必ずビルドが通ることを確認してください。

```bash
cd /Users/shihoffici4l/tokuyou-web && npx tsc --noEmit && npx vite build
```

ビルドが失敗した場合はエラーを修正してから次に進んでください。

## 3. コミット

変更ファイルをステージングしてコミットしてください。

- コミットメッセージは `$ARGUMENTS` が指定されていればそれを使う
- 指定がなければ変更内容から適切なメッセージを作成する
- メッセージは日本語で記述する

```bash
cd /Users/shihoffici4l/tokuyou-web
git add <変更ファイル>
git commit -m "コミットメッセージ"
```

## 4. GitHubにプッシュ

```bash
git -C /Users/shihoffici4l/tokuyou-web push origin main
```

## 5. Vercelにデプロイ

```bash
cd /Users/shihoffici4l/tokuyou-web && vercel --yes --prod
```

## 6. 結果の報告

デプロイが完了したら、以下を報告してください：

- デプロイ成功/失敗
- 公開URL: https://tokuyou-web.vercel.app
- 変更内容の要約
