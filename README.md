# blog

Astro + TypeScript で構築した静的ブログサイト。GitHub Pages で自動デプロイされます。

## 設定手順

1. **環境変数の設定**
   - `.env` ファイルの `PUBLIC_HATENA_FEED` を自分の Hatena Blog フィード URL に変更
   - `astro.config.mjs` の `site` と `base` を自分の GitHub Pages URL に変更

2. **GitHub Secrets の設定**
   - リポジトリの Settings > Secrets > Actions で `PUBLIC_HATENA_FEED` を追加

3. **GitHub Pages の有効化**
   - Settings > Pages > Source を "Deploy from a branch" に設定
   - Branch を `gh-pages` / `root` に設定

## 開発

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm run dev

# ビルド
pnpm run build

# ビルド結果のプレビュー
pnpm run preview
```

## 記事の追加

`content/news/` ディレクトリに `YYYYMMDD.md` 形式でファイルを追加すると、自動的にサイトに反映されます。

```markdown
---
title: 記事タイトル（省略可）
pubDate: 2025-07-06（省略可）
---

記事の内容...
```

Front-matter がない場合は、ファイル名から日付とタイトルが自動生成されます。
