---
layout: base.njk
title: タイトル
permalink: /markdown-cheatsheet.html
---

## 見出し(h2)

これはテストです

### サブ見出し(h3)

さらにテストです

#### サブサブ見出し(h4)

さらにさらにテストです

##### サブサブサブ見出し(h5)

さらにさらにさらにテストです

###### サブサブサブサブ見出し(h6)

さらにさらにさらにさらにテストです

## 強調テキスト

山路を登りながらこう考えた。  
**山路** を登りながらこう考えた。  
*山路* を登りながらこう考えた。  
~~山路~~ を登りながらこう考えた。  
`山路` を登りながらこう考えた。  

## リスト

番号なしリスト

- Level 1 list item
- Level 1 list item
- Level 1 list item
  - Level 2 list item
    - Level 3 list item
- Level 1 list item

番号付きリスト

1. Level 1 list item
2. Level 1 list item
3. Level 1 list item
   1. Level 2 list item
      1. Level 3 list item
4. Level 1 list item

## 数式

ブロック数式

$$
e^{i\pi} + 1 = 0
$$

\\\[
e^{i\pi} + 1 = 0
\\\]

これはインライン数式 $E=mc^2$ です。

これはインライン数式 \\\(E=mc^2\\\) です。

## 補足ブロック

> **NOTE**: これは補足アドモニションです。

> **IMPORTANT**: これは重要なアドモニションです。

> **TIP**: これはヒントのアドモニションです。

> **CAUTION**: これは注意のアドモニションです。

> **WARNING**: これは警告のアドモニションです。

## 画像

![サンプル画像](https://placehold.jp/150x150.png)

## スケッチ

<div class="sketch" sketch-name="test-sketch"></div>

## 折りたたみ

<details>
  <summary>クリックして開く</summary>

  ここは畳まれるはず

  <details>
    <summary>さらに折りたたみ</summary>

    ネストされた折り畳み
  </details>
</details>
