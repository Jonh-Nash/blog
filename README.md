# blog

## ローカルでの開発

- `npm run local-check-start`
  - `npm run build`
  - `out` ディレクトリに静的ファイルが生成される
  - `npx serve@latest out`
    - Why?: ビルドされたパスがサーバ上で解決されるため、ローカルで確認するためにはサーバを立てる必要がある
  - ブラウザから確認

## 使用ライブラリ

### ブログ本体

- grey-matter: Markdown のメタデータをパースする
- marked: markdown を html に変換する

### スクリプト

- ts-node: TypeScript を実行するためのツール
- dotenv: 環境変数を読み込むためのツール
- dayjs: 日付を扱うためのツール
- openai: OpenAI API を叩くためのツール
- rss-parser: RSS をパースするためのツール

## 開発メモ

### generateStaticParams

App Router は元々動的ルーティングであるが、`generateStaticParams` を使うことで build 時に静的ルーティングを行うことができる。

- [参考](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

## 便利スクリプト

- TechCrunch から記事を取得して翻訳、メタ情報と翻訳内容を Markdown ファイルとして追加してくれるスクリプト
  - `npm run fetch:techcrunch`
  - 追加: 読んだけど消した記事を追加しないようにする
  - 追加: Web 検索で記事本体を取得して要約する
- 読んでいない記事一覧から記事を取得して、メタ情報を Markdown ファイルとして追加してくれるスクリプト
  - `npm run fetch:unread`
  - 追加: Web 検索で記事本体を取得して要約する
- Essay から一週間の記事を取得して、AI News として Markdown ファイルとして追加してくれるスクリプト
  - `npm run make:ai-news`
  - AI だけでなくソフトウェアエンジニアリングに関する記事も取得する

## アイデア

- 技術の根本、ビジネスの根本から考えるとどうかを LLM に聞いてみる
  - 技術の根本とは？
  - ビジネスの根本とは？: マーケット,
- 同じようなやつはコンポーネントに切り出して再利用できるようにする
