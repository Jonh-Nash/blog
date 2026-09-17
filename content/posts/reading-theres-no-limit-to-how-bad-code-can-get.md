---
title: 「There's No Limit to How Bad Code Can Get」を読んで
date: 2026-09-07
slug: reading-theres-no-limit-to-how-bad-code-can-get
tags:
  - reading-note
  - software-engineering
  - technical-debt
source:
  title: There's No Limit to How Bad Code Can Get
  url: https://simonwillison.net/2026/Sep/6/theres-no-limit-to-how-bad-code-can-get/
  author: Simon Willison
  publishedDate: 2026-09-06
  accessedDate: 2026-09-07
---

## ひとことで

全面リライトの難しさは、コードを書く量だけではない。移行中も変化し続ける旧システムと、そこに埋まっている暗黙の仕様をどう扱うかが本当の問題なのだと思った。

## 残しておきたい引用

### テストと文書が足りないからこそ、置き換えは難しい

> If it was well documented and tested it wouldn't need to be replaced, after all...

[引用箇所](https://simonwillison.net/2026/Sep/6/theres-no-limit-to-how-bad-code-can-get/)

リライトを始めるときには、既存システムの問題点はよく見えている。一方で、現在の挙動がなぜそうなっているか、利用者が何に依存しているかまでは理解できていないことがある。

ドキュメントやテストが乏しいシステムでは、仕様をコードから発掘する作業そのものがリライトの一部になる。きれいな設計を考えることより、失われている知識を回収することのほうが難しいのかもしれない。

### 一つを置き換えるつもりが、二つを保守することになる

> ... so now you have TWO systems in production

[引用箇所](https://simonwillison.net/2026/Sep/6/theres-no-limit-to-how-bad-code-can-get/)

新システムが一部の機能だけで本番投入されると、旧システムは消えず、運用・調査・データ整合性の対象が増える。全面リライトは技術負債を消す計画だったはずなのに、完了するまでは負債を二重化する計画にもなりうる。

特に印象に残ったのは、旧システムを担当する側のインセンティブまで悪化するという点だ。廃止予定のコードには最小限の変更しか加えたくなくなる。しかし事業が動く限り変更は止まらず、その間にも新旧の差は広がっていく。

## 残った問い

- 全面リライトを選ぶべき条件は何か
- 既存システムの暗黙の仕様を、移行前にどこまでテストとして固定すべきか
- 新旧二重運用の期間とコストを、計画時点でどう見積もればよいか
- 小さなリファクタリングでは到達できない境界をどう判断するか

## 次に試すこと

- リライトを提案する前に、既存システムへ characterization test を追加できないか検討する
- 一括置換ではなく、機能単位で移行して価値を届けられる順序を考える
- 完了条件だけでなく、移行を中止・縮小する条件も先に決める
