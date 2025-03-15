# blog

## ローカルでの開発

- `npm run build`
- `out` ディレクトリに静的ファイルが生成される
- ブラウザから確認

## 使用ライブラリ

- grey-matter: Markdown のメタデータをパースする
- marked: markdown を html に変換する

## 開発メモ

### generateStaticParams

App Router は元々動的ルーティングであるが、`generateStaticParams` を使うことで build 時に静的ルーティングを行うことができる。

- [参考](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
