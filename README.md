# blog

## ローカルでの開発

- `npm run build`
- `out` ディレクトリに静的ファイルが生成される
- `npx serve@latest out`
  - Why?: ビルドされたパスがサーバ上で解決されるため、ローカルで確認するためにはサーバを立てる必要がある
- ブラウザから確認

## 使用ライブラリ

- grey-matter: Markdown のメタデータをパースする
- marked: markdown を html に変換する

## 開発メモ

### generateStaticParams

App Router は元々動的ルーティングであるが、`generateStaticParams` を使うことで build 時に静的ルーティングを行うことができる。

- [参考](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

## 便利スクリプト

- TechCrunch から記事を取得して翻訳、メタ情報と翻訳内容を Markdown ファイルとして追加してくれるスクリプト
  - `npm run fetch:techcrunch`
- 読んでいない記事一覧から記事を取得して、Web 閲覧、要約、メタ情報を Markdown ファイルとして追加してくれるスクリプト
  - `npm run fetch:unread`
- Essay から一週間の記事を取得して、AI News として Markdown ファイルとして追加してくれるスクリプト
  - `npm run make:ai-news`
