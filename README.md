# blog

## アプリケーション概要

このリポジトリは、Markdown ファイルを記事として公開する Next.js 製の個人ブログです。

`content/posts/*.md` の frontmatter から `title`、`date`、`description`、`slug`、`tags` を読み取り、トップページの記事一覧と `/posts/[slug]` の記事詳細ページを静的に生成します。Markdown 本文は HTML に変換したあと、`sanitize-html` でサニタイズして表示します。

`next.config.ts` では静的エクスポート用に `output: "export"`、`basePath: "/blog"`、`assetPrefix: "/blog/"`、`trailingSlash: true` が設定されています。`npm run build` の出力先は `out/` です。

このブログの目的は次のとおりです。

- 自分の考えを一箇所にまとめる
- 自分のアイデアを一箇所にまとめる
- 自分の経歴をまとめる

## 必要な前提環境

- Node.js 20.19.x または 22.12.0 以上
- npm

`package-lock.json` に記録されている Next.js の `engines.node` は `>=20.9.0`、`npm run test` が使う Vite の `engines.node` は `^20.19.0 || >=22.12.0` です。リポジトリには `package-lock.json` があるため、パッケージマネージャは npm です。

ローカル起動に必要な環境変数は確認されていません。`.env` 系ファイルは `.gitignore` の対象です。

## 依存関係のインストール方法

```bash
npm ci
```

## ローカル環境での起動方法

```bash
npm run dev
```

`package.json` の `dev` スクリプトは `next dev` です。`next.config.ts` で `basePath: "/blog"` が設定されているため、起動後は `http://localhost:3000/blog/` にアクセスしてください。

## テストの実行方法

```bash
npm run test
```

`package.json` の `test` スクリプトは `vitest run` です。`vitest.config.ts` ではテスト環境に `jsdom` を指定しています。

## ビルド方法

```bash
npm run build
```

`package.json` の `build` スクリプトは `next build` です。`next.config.ts` の `output: "export"` により、静的ファイルは `out/` に出力されます。

## 主要ディレクトリ

| パス              | 用途                                     |
| ----------------- | ---------------------------------------- |
| `src/app/`        | Next.js App Router のページとレイアウト  |
| `src/components/` | 表示コンポーネント                       |
| `src/lib/`        | Markdown 記事の読み取り、検証、HTML 変換 |
| `content/posts/`  | 記事 Markdown ファイル                   |

## 記事の追加方法

`content/posts/` に `.md` ファイルを追加し、次の frontmatter を設定します。

```markdown
---
title: Article title
date: 2026-05-26
description: Article description
slug: article-slug
tags:
  - idea
---
```

`slug` は記事詳細ページの URL に使われます。必須 frontmatter（`title`, `date`, `description`, `slug`, `tags`）が欠けている場合や `slug` が重複している場合、記事読み取り処理はエラーを投げます。

## 読んだ記事についてメモする

`content/templates/reading-note.md` を `content/posts/` にコピーして使います。おすすめの書き方は次の順序です。

1. `ひとことで` に、記事の要約ではなく自分に残ったことを書く
2. 残したい原文を Markdown の引用記法（`>`）で短く引用する
3. 各引用のすぐ下に、自分の解釈・経験とのつながり・反論を書く
4. まだ答えが出ていないことは `残った問い` に逃がす

引用文は必要な範囲に絞り、引用と自分の文章を明確に分けます。引用箇所を直接示せる URL がある場合は、テンプレートの `引用箇所` リンクも残してください。

読書メモでは、任意の `source` frontmatter を使えます。`title` と `url` は `source` を使う場合の必須項目で、`author`、`publishedDate`、`accessedDate` は省略可能です。元記事の情報は記事詳細ページの冒頭に表示されます。

```yaml
source:
  title: 元記事のタイトル
  url: https://example.com/article
  author: 著者名
  publishedDate: 2026-09-01
  accessedDate: 2026-09-07
```
