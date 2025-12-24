# SOARA Design System v2.0

**Apple HIG準拠 × SOARA ブランドアイデンティティ**

最終更新: 2024年12月15日

---

## 📋 目次

1. [デザイン哲学](#デザイン哲学)
2. [カラーシステム](#カラーシステム)
3. [タイポグラフィ](#タイポグラフィ)
4. [スペーシング](#スペーシング)
5. [角丸](#角丸)
6. [シャドウ](#シャドウ)
7. [コンポーネント](#コンポーネント)
8. [アクセシビリティ](#アクセシビリティ)
9. [レスポンシブ](#レスポンシブ)
10. [アニメーション](#アニメーション)
11. [実装例](#実装例)

---

## 🎯 デザイン哲学

### コアコンセプト
**「未来への飛翔を体現する、洗練されたテクノロジー体験」**

- **SOARAブランド**: 青のグラデーション、航空への情熱、革新性
- **Apple哲学**: シンプルさ、明快さ、感情的なつながり
- **ターゲット**: 高校生・大学生の共感 × 企業の信頼獲得

### 優先順位
1. **カラー・ビジュアル**: SOARA独自性を最優先
2. **レイアウト・インタラクション**: Apple HIG準拠
3. **アクセシビリティ**: WCAG 2.1 AA必須

---

## 🎨 カラーシステム

### ブランドカラー（SOARA固有）

```javascript
// tailwind.config.js
colors: {
  // SOARA Primary Blue - ブランドの核
  soara: {
    50: '#e6f4ff',
    100: '#b3deff',
    200: '#80c8ff',
    300: '#4db3ff',
    400: '#369bff',  // グラデーション開始点
    500: '#1a8cff',
    600: '#0076e6',
    700: '#0060cc',
    800: '#0050a7',  // グラデーション終了点
    900: '#003d80',
  },
  
  // Accent - エネルギーと行動喚起
  sky: {
    DEFAULT: '#00d4ff',
    light: '#33ddff',
    dark: '#00a8cc',
  },
  
  // Apple風 Neutral - 洗練された階層
  gray: {
    50: '#f5f7fa',   // 背景・最も明るい
    100: '#ebeef3',  // カード背景
    200: '#d4dae5',  // ボーダー
    300: '#b0bbd0',  // 無効状態
    400: '#8b9dc3',  // プレースホルダー
    500: '#6b7fa3',  // セカンダリテキスト
    600: '#556484',  // 本文テキスト
    700: '#3e4a63',  // 見出し
    800: '#1a2332',  // 強調テキスト
    900: '#0a0a0a',  // 最も濃い黒
  },
  
  // Semantic Colors - Apple HIG準拠
  blue: '#007AFF',      // 情報・リンク
  green: '#34C759',     // 成功
  yellow: '#FFCC00',    // 警告
  red: '#FF3B30',       // エラー
  purple: '#AF52DE',    // 特別
}

// グラデーション
backgroundImage: {
  'gradient-soara': 'linear-gradient(135deg, #369bff 0%, #0050a7 100%)',
  'gradient-sky': 'linear-gradient(135deg, #00d4ff 0%, #369bff 100%)',
  'gradient-hero': 'linear-gradient(180deg, rgba(54, 155, 255, 0.9) 0%, rgba(0, 80, 167, 0.95) 100%)',
}
```

### カラー使用ルール

```jsx
// ✅ Primary Actions - SOARAブルー
<button className="bg-gradient-soara text-white">
  スポンサーになる
</button>

// ✅ Secondary Actions - Apple風グレー
<button className="bg-gray-800 text-white hover:bg-gray-700">
  詳細を見る
</button>

// ✅ Tertiary Actions - ゴースト
<button className="text-soara-600 hover:bg-soara-50">
  もっと見る
</button>

// ✅ 背景階層
<div className="bg-white">           {/* Level 0: ベース */}
  <div className="bg-gray-50">      {/* Level 1: カード背景 */}
    <div className="bg-gray-100">   {/* Level 2: セクション */}
    </div>
  </div>
</div>
```

### コントラスト必須ルール（WCAG AA）

| 背景 | テキスト色 | コントラスト比 | 用途 |
|------|-----------|--------------|------|
| `bg-white` | `text-gray-800` | 12.6:1 ✅ | 本文 |
| `bg-white` | `text-gray-600` | 7.2:1 ✅ | セカンダリテキスト |
| `bg-soara-800` | `text-white` | 8.9:1 ✅ | ヒーローセクション |
| `bg-gray-50` | `text-gray-700` | 8.9:1 ✅ | カード本文 |

---

## ✍️ タイポグラフィ

### Apple HIG準拠フォントスケール

```javascript
fontFamily: {
  // Apple風システムフォントスタック
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"SF Pro JP"',
    '"Hiragino Sans"',
    '"Hiragino Kaku Gothic ProN"',
    '"Noto Sans JP"',
    'sans-serif',
  ],
  mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
}

fontSize: {
  // Apple HIG Text Styles
  'largeTitle': ['34px', { lineHeight: '41px', letterSpacing: '0.37px', fontWeight: '700' }],
  'title1': ['28px', { lineHeight: '34px', letterSpacing: '0.36px', fontWeight: '700' }],
  'title2': ['22px', { lineHeight: '28px', letterSpacing: '0.35px', fontWeight: '600' }],
  'title3': ['20px', { lineHeight: '25px', letterSpacing: '0.38px', fontWeight: '600' }],
  'headline': ['17px', { lineHeight: '22px', letterSpacing: '-0.43px', fontWeight: '600' }],
  'body': ['17px', { lineHeight: '22px', letterSpacing: '-0.43px', fontWeight: '400' }],
  'callout': ['16px', { lineHeight: '21px', letterSpacing: '-0.32px', fontWeight: '400' }],
  'subheadline': ['15px', { lineHeight: '20px', letterSpacing: '-0.24px', fontWeight: '400' }],
  'footnote': ['13px', { lineHeight: '18px', letterSpacing: '-0.08px', fontWeight: '400' }],
  'caption1': ['12px', { lineHeight: '16px', letterSpacing: '0px', fontWeight: '400' }],
  'caption2': ['11px', { lineHeight: '13px', letterSpacing: '0.07px', fontWeight: '400' }],
}
```

### 使用例

```jsx
{/* ヒーローセクション専用 */}
<h1 className="text-largeTitle font-bold text-white tracking-tight">
  日本初、高校生による人力飛行機挑戦
</h1>

{/* ページ主見出し */}
<h1 className="text-title1 font-bold text-gray-900">
  私たちのミッション
</h1>

{/* セクション見出し */}
<h2 className="text-title2 font-semibold text-gray-900">
  機体仕様
</h2>

{/* カード見出し */}
<h4 className="text-headline font-semibold text-gray-900">
  スポンサープラン
</h4>

{/* 本文 */}
<p className="text-body text-gray-600">
  私たちSOARAは、2026年鳥人間コンテスト滑空機部門への出場を目指す...
</p>

{/* 補足情報 */}
<p className="text-subheadline text-gray-500">
  更新日: 2024年12月15日
</p>

{/* ラベル・メタ情報 */}
<span className="text-caption1 text-gray-400 uppercase tracking-wider">
  CATEGORY
</span>
```

### レスポンシブタイポグラフィ

```jsx
{/* モバイル → タブレット → デスクトップ */}
<h1 className="
  text-title2        /* Mobile: 22px */
  sm:text-title1     /* Tablet: 28px */
  lg:text-largeTitle /* Desktop: 34px */
  font-bold text-gray-900
">
  見出し
</h1>

<p className="
  text-callout       /* Mobile: 16px */
  sm:text-body       /* Desktop: 17px */
  text-gray-600
">
  本文テキスト
</p>
```

---

## 📐 スペーシング

### Apple 8pt Grid System

```javascript
spacing: {
  '0': '0px',
  '1': '4px',    // 0.5 unit
  '2': '8px',    // 1 unit - 最小余白
  '3': '12px',   // 1.5 unit
  '4': '16px',   // 2 unit - 基本余白
  '5': '20px',   // 2.5 unit
  '6': '24px',   // 3 unit - 小セクション
  '8': '32px',   // 4 unit - 中セクション
  '10': '40px',  // 5 unit
  '12': '48px',  // 6 unit - 大セクション
  '16': '64px',  // 8 unit - ページセクション
  '20': '80px',  // 10 unit
  '24': '96px',  // 12 unit - 特大セクション
  '32': '128px', // 16 unit - ヒーロー
}
```

### コンポーネント別余白ルール

```jsx
{/* セクション間隔 */}
<section className="py-16 md:py-24 lg:py-32">
  {/* コンテナ */}
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* 見出しと本文の間 */}
    <h2 className="text-title1 font-bold mb-4">見出し</h2>
    <p className="text-body text-gray-600 mb-8">本文...</p>
    
    {/* カードグリッド */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* カード内部余白 */}
      <div className="bg-white rounded-2xl p-6">
        <h3 className="text-headline font-semibold mb-3">カードタイトル</h3>
        <p className="text-callout text-gray-600 mb-4">説明...</p>
      </div>
    </div>
  </div>
</section>

{/* Apple風タイトコンポーネント */}
<div className="space-y-1">  {/* 4px間隔 */}
  <h3 className="text-headline font-semibold">項目名</h3>
  <p className="text-footnote text-gray-500">補足情報</p>
</div>

{/* Apple風リストアイテム */}
<ul className="space-y-4">  {/* 16px間隔 */}
  <li className="flex items-start gap-3">
    <Icon />
    <div className="space-y-1">
      <p className="text-body font-medium">項目</p>
      <p className="text-subheadline text-gray-500">詳細</p>
    </div>
  </li>
</ul>
```

---

## ⭕ 角丸

### Apple風曲線半径

```javascript
borderRadius: {
  'none': '0',
  'xs': '4px',     // 小要素（バッジ）
  'sm': '6px',     // チップ
  'DEFAULT': '8px', // ボタン小
  'md': '10px',    // ボタン標準
  'lg': '12px',    // カード小
  'xl': '16px',    // カード標準
  '2xl': '20px',   // カード大
  '3xl': '24px',   // モーダル
  '4xl': '32px',   // ヒーロー要素
  'full': '9999px', // 完全円形
}
```

### 使用ガイドライン

```jsx
{/* Apple風ボタン */}
<button className="rounded-lg px-6 py-3">  {/* 12px */}
  標準ボタン
</button>

{/* Apple風カード */}
<div className="bg-white rounded-2xl shadow-lg overflow-hidden">  {/* 20px */}
  <img src="..." className="w-full" />
  <div className="p-6">...</div>
</div>

{/* Apple風モーダル */}
<div className="bg-white rounded-3xl shadow-2xl">  {/* 24px */}
  モーダルコンテンツ
</div>

{/* バッジ・ピル */}
<span className="bg-soara-100 text-soara-700 px-3 py-1 rounded-full text-caption1 font-medium">
  新着
</span>
```

---

## 🌑 シャドウ

### Apple風レイヤーシステム

```javascript
boxShadow: {
  // Apple風の柔らかい影
  'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'sm': '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.25)',
  
  // SOARAブルーのアクセント影（CTA専用）
  'soara': '0 10px 40px -10px rgba(54, 155, 255, 0.3)',
  'sky': '0 10px 40px -10px rgba(0, 212, 255, 0.3)',
  
  // Inner shadow
  'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
}
```

### 階層別使用ルール

```jsx
{/* Level 0: フラット */}
<div className="bg-gray-50">コンテンツ</div>

{/* Level 1: 浮遊感 */}
<div className="bg-white rounded-2xl shadow-sm">カード</div>

{/* Level 2: インタラクティブ */}
<div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
  ホバー可能なカード
</div>

{/* Level 3: 最前面 */}
<div className="bg-white rounded-3xl shadow-2xl">モーダル</div>

{/* SOARAブルー強調 - Primary CTA */}
<button className="bg-gradient-soara text-white rounded-lg shadow-soara hover:shadow-sky transition-shadow duration-300">
  今すぐ参加
</button>
```

---

## 🧩 コンポーネント

### ボタン

#### バリアント

```jsx
// Filled - 最も強い行動喚起
<button className="
  bg-gradient-soara text-white shadow-soara
  hover:shadow-sky hover:brightness-110
  px-6 py-3 rounded-lg font-semibold
  transition-all duration-200
  focus:ring-4 focus:ring-soara-300 focus:ring-offset-2
  active:scale-[0.98]
">
  スポンサーになる
</button>

// Tinted - Apple風の淡い背景
<button className="
  bg-soara-100 text-soara-700
  hover:bg-soara-200
  px-5 py-2.5 rounded-lg font-semibold
  transition-colors duration-200
  focus:ring-4 focus:ring-soara-300
">
  詳細を見る
</button>

// Gray - セカンダリアクション
<button className="
  bg-gray-100 text-gray-900
  hover:bg-gray-200
  px-5 py-2.5 rounded-lg font-semibold
  transition-colors duration-200
">
  キャンセル
</button>

// Plain - テキストのみ
<button className="
  text-soara-600 hover:bg-soara-50
  px-4 py-2 rounded-lg font-semibold
  transition-colors duration-200
">
  もっと見る →
</button>
```

#### サイズ

```jsx
// Small
<button className="px-4 py-2 text-subheadline">小</button>

// Medium (デフォルト)
<button className="px-5 py-2.5 text-body">中</button>

// Large
<button className="px-6 py-3 text-headline">大</button>
```

### カード

```jsx
// Elevated - 標準的な浮遊カード
<div className="
  bg-white rounded-2xl shadow-md
  hover:shadow-lg hover:-translate-y-0.5
  transition-all duration-300
  p-6
">
  <img src="..." className="w-full aspect-video object-cover rounded-xl mb-4" />
  <span className="text-caption1 text-soara-600 font-semibold uppercase tracking-wider">
    Technology
  </span>
  <h3 className="text-headline font-semibold text-gray-900 mt-2 mb-2">
    カードタイトル
  </h3>
  <p className="text-callout text-gray-600 mb-4">
    説明文...
  </p>
  <button className="text-soara-600 hover:bg-soara-50 px-4 py-2 rounded-lg text-body font-semibold">
    詳細を見る →
  </button>
</div>

// Filled - 背景色付き
<div className="
  bg-gray-50 rounded-2xl
  hover:bg-gray-100
  transition-colors duration-200
  p-6
">
  コンテンツ
</div>

// Outlined - 境界線のみ
<div className="
  bg-white rounded-2xl
  border-2 border-gray-200
  hover:border-gray-300
  transition-colors duration-200
  p-6
">
  コンテンツ
</div>
```

### 入力フィールド

```jsx
// テキスト入力
<div className="w-full">
  <label className="block text-subheadline font-medium text-gray-900 mb-2">
    メールアドレス
  </label>
  <input
    type="email"
    placeholder="your@email.com"
    className="
      w-full px-4 py-3 rounded-xl
      text-body bg-gray-50
      border-2 border-transparent
      focus:border-soara-500 focus:bg-white
      focus:ring-4 focus:ring-soara-100
      placeholder:text-gray-400
      transition-all duration-200
    "
  />
  <p className="mt-2 text-footnote text-gray-500">
    連絡可能なメールアドレスを入力してください
  </p>
</div>

// エラー状態
<input
  className="
    w-full px-4 py-3 rounded-xl
    text-body bg-red/5
    border-2 border-red
    focus:border-red focus:bg-red/10
    focus:ring-4 focus:ring-red/20
    transition-all duration-200
  "
/>
<p className="mt-2 text-footnote text-red">
  有効なメールアドレスを入力してください
</p>

// Textarea
<textarea
  rows="4"
  className="
    w-full px-4 py-3 rounded-xl
    text-body bg-gray-50
    border-2 border-transparent
    focus:border-soara-500 focus:bg-white
    focus:ring-4 focus:ring-soara-100
    placeholder:text-gray-400
    resize-none
    transition-all duration-200
  "
/>
```

### バッジ

```jsx
// Tinted
<span className="
  inline-flex items-center gap-1
  bg-soara-100 text-soara-700
  px-2.5 py-1 rounded-full
  text-caption1 font-semibold
">
  募集中
</span>

// Filled
<span className="
  inline-flex items-center gap-1
  bg-gradient-soara text-white
  px-3 py-1.5 rounded-full
  text-footnote font-semibold
">
  新着
</span>

// アイコン付き
<span className="
  inline-flex items-center gap-1
  bg-green/10 text-green
  px-2.5 py-1 rounded-full
  text-caption1 font-semibold
">
  <svg className="w-3 h-3" />
  完了
</span>
```

### モーダル

```jsx
{/* Backdrop */}
<div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

{/* Modal */}
<div className="fixed inset-0 z-50 overflow-y-auto">
  <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
    <div className="
      max-w-2xl w-full
      bg-white rounded-t-3xl sm:rounded-3xl
      shadow-2xl
    ">
      {/* iOS風 Handle bar */}
      <div className="flex justify-center pt-3 pb-2 sm:hidden">
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-title2 font-bold text-gray-900">
          お問い合わせ
        </h2>
        <button className="
          w-8 h-8 flex items-center justify-center
          text-gray-500 hover:text-gray-900 hover:bg-gray-100
          rounded-full transition-colors
        ">
          ✕
        </button>
      </div>
      
      {/* Content */}
      <div className="px-6 py-6">
        コンテンツ
      </div>
    </div>
  </div>
</div>
```

---

## ♿ アクセシビリティ

### カラーコントラスト（WCAG AA準拠）

```jsx
// ✅ 適切なコントラスト
<p className="text-gray-800 bg-white">本文テキスト (12.6:1)</p>
<p className="text-white bg-soara-800">白文字・濃青背景 (8.9:1)</p>

// ❌ 避けるべき
// text-gray-400 bg-white (2.8:1) - 不十分
```

### フォーカス管理

```jsx
// すべてのインタラクティブ要素
<button className="
  focus:outline-none
  focus:ring-4
  focus:ring-soara-300
  focus:ring-offset-2
">
  ボタン
</button>

// リンク
<a
  href="#"
  className="
    text-soara-600 hover:underline
    focus:ring-4 focus:ring-soara-300
    rounded-md px-2 py-1
  "
>
  リンク
</a>
```

### ARIA属性

```jsx
// ボタン状態
<button
  aria-pressed={isActive}
  aria-label="メニューを開く"
  aria-expanded={isMenuOpen}
>
  <MenuIcon />
</button>

// ナビゲーション
<nav aria-label="メインナビゲーション">
  <ul role="list">
    <li><a href="#about">About</a></li>
  </ul>
</nav>

// モーダル
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">タイトル</h2>
</div>

// ローディング
<div role="status" aria-live="polite">
  {isLoading ? '読み込み中...' : '完了'}
</div>

// スクリーンリーダー専用
<span className="sr-only">ページの先頭へ戻る</span>
```

### タッチターゲット（44px最小）

```jsx
// ✅ 適切なサイズ
<button className="min-h-[44px] min-w-[44px] px-6 py-3">
  送信
</button>

// アイコンボタン
<button className="w-11 h-11 flex items-center justify-center rounded-full">
  <svg className="w-5 h-5" />
</button>
```

### モーション削減

```jsx
// prefers-reduced-motion対応
<div className="
  transition-all duration-300
  motion-safe:hover:scale-105
  motion-reduce:transition-none
  motion-reduce:hover:scale-100
">
  カード
</div>
```

---

## 📱 レスポンシブ

### ブレークポイント

```javascript
screens: {
  'xs': '375px',   // iPhone SE
  'sm': '390px',   // iPhone 12/13/14
  'md': '768px',   // iPad Mini
  'lg': '1024px',  // iPad Pro 11"
  'xl': '1280px',  // Desktop
  '2xl': '1536px', // Large Desktop
}
```

### モバイルファースト実装

```jsx
{/* ヒーローセクション */}
<section className="
  relative min-h-screen flex items-center justify-center
  px-4 sm:px-6 lg:px-8
  py-20 sm:py-24 lg:py-32
">
  <h1 className="
    text-title1       /* Mobile: 28px */
    sm:text-largeTitle /* Tablet: 34px */
    lg:text-[44px]    /* Desktop: 44px */
    font-bold text-white
  ">
    見出し
  </h1>
  
  {/* CTA - スタック→横並び */}
  <div className="
    flex flex-col sm:flex-row gap-3 sm:gap-4
    justify-center items-stretch sm:items-center
  ">
    <button className="w-full sm:w-auto">ボタン1</button>
    <button className="w-full sm:w-auto">ボタン2</button>
  </div>
</section>

{/* カードグリッド */}
<div className="
  grid
  grid-cols-1          /* Mobile: 1列 */
  sm:grid-cols-2       /* Tablet: 2列 */
  lg:grid-cols-3       /* Desktop: 3列 */
  xl:grid-cols-4       /* Large: 4列 */
  gap-4 sm:gap-6 lg:gap-8
">
  {/* カード */}
</div>

{/* ナビゲーション */}
<nav className="
  fixed top-0 left-0 right-0 z-50
  bg-white/80 backdrop-blur-xl
  border-b border-gray-200
">
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16 sm:h-20">
      <div className="flex-shrink-0">
        <img src="/logo.svg" className="h-8 sm:h-10" />
      </div>
      
      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-1">
        <a href="#about" className="px-4 py-2 text-body rounded-lg hover:bg-gray-50">
          About
        </a>
      </div>
      
      {/* Mobile Menu Button */}
      <button className="lg:hidden w-11 h-11">
        <MenuIcon />
      </button>
    </div>
  </div>
</nav>
```

---

## 🎬 アニメーション

### Apple風イージング

```javascript
transitionTimingFunction: {
  'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',      // 標準
  'apple-in': 'cubic-bezier(0.42, 0, 1, 1)',        // Ease In
  'apple-out': 'cubic-bezier(0, 0, 0.58, 1)',       // Ease Out
  'apple-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)', // Ease In Out
}

transitionDuration: {
  '150': '150ms',  // マイクロインタラクション
  '250': '250ms',  // 標準トランジション
  '350': '350ms',  // ページ遷移
  '600': '600ms',  // 大きな変化
}
```

### 実装例

```jsx
// ホバーエフェクト
<button className="
  transform transition-all duration-250 ease-apple
  hover:scale-[1.02] hover:shadow-lg
  active:scale-[0.98]
">
  ボタン
</button>

// カードのホバー
<div className="
  transform transition-all duration-350 ease-apple
  hover:-translate-y-1 hover:shadow-xl
">
  カード
</div>

// フェードイン
<div className="
  opacity-0 translate-y-8
  transition-all duration-600 ease-apple
  [&.visible]:opacity-100 [&.visible]:translate-y-0
">
  スクロールで表示
</div>
```

---

## 📦 実装例

### Hero Section

```jsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
  {/* 背景画像 + グラデーション */}
  <div className="absolute inset-0">
    <img 
      src="/hero-aircraft.jpg" 
      alt="" 
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-hero" />
  </div>
  
  {/* コンテンツ */}
  <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
    {/* バッジ */}
    <div className="mb-6">
      <span className="
        inline-flex items-center gap-1
        bg-soara-100/90 text-soara-700
        px-3 py-1.5 rounded-full
        text-caption1 font-semibold
        backdrop-blur-sm
      ">
        🎯 2026年鳥人間コンテスト出場予定
      </span>
    </div>
    
    {/* メインタイトル */}
    <h1 className="
      text-title1 sm:text-largeTitle lg:text-[44px]
      font-bold text-white mb-6 sm:mb-8
      leading-tight tracking-tight
    ">
      日本初、高校生による
      <br className="hidden sm:block" />
      <span className="bg-gradient-sky bg-clip-text text-transparent">
        人力飛行機
      </span>
      挑戦
    </h1>
    
    {/* サブタイトル */}
    <p className="
      text-callout sm:text-body
      text-white/90 mb-8 sm:mb-12
      max-w-2xl mx-auto
    ">
      私たちSOARAは、25名の高校生・大学生チームで
      2026年鳥人間コンテスト滑空機部門への出場を目指します
    </p>
    
    {/* CTA */}
    <div className="
      flex flex-col sm:flex-row gap-3 sm:gap-4
      justify-center items-stretch sm:items-center
    ">
      <button className="
        bg-gradient-soara text-white
        px-8 py-4 rounded-lg text-headline font-semibold
        shadow-soara hover:shadow-sky
        transition-all duration-250 ease-apple
        focus:ring-4 focus:ring-soara-300 focus:ring-offset-2
        active:scale-[0.98]
        w-full sm:w-auto
      ">
        スポンサー募集 →
      </button>
      <button className="
        bg-white/10 backdrop-blur-sm text-white
        border-2 border-white/30
        px-8 py-4 rounded-lg text-headline font-semibold
        hover:bg-white/20
        transition-all duration-250 ease-apple
        focus:ring-4 focus:ring-white/30
        w-full sm:w-auto
      ">
        チームについて
      </button>
    </div>
  </div>
</section>
```

### Feature Cards

```jsx
<section className="py-16 sm:py-24 lg:py-32 bg-white">
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* セクションヘッダー */}
    <div className="text-center mb-12 lg:mb-16">
      <h2 className="text-title1 sm:text-largeTitle font-bold text-gray-900 mb-4">
        SOARAの特徴
      </h2>
      <p className="text-body text-gray-600 max-w-2xl mx-auto">
        日本初の高校生チームとして、革新的なアプローチで人力飛行機開発に挑戦
      </p>
    </div>
    
    {/* カードグリッド */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* カード */}
      <div className="
        bg-white rounded-2xl shadow-md
        hover:shadow-lg hover:-translate-y-0.5
        transition-all duration-350 ease-apple
        p-6 lg:p-8
      ">
        {/* アイコン */}
        <div className="
          w-14 h-14 rounded-2xl
          bg-soara-100
          flex items-center justify-center
          text-2xl mb-4
        ">
          ✈️
        </div>
        
        {/* タイトル */}
        <h3 className="text-headline font-semibold text-gray-900 mb-3">
          先進的な空力設計
        </h3>
        
        {/* 説明 */}
        <p className="text-callout text-gray-600">
          XFLR5を用いた精密なシミュレーションと実機テストの融合
        </p>
      </div>
      
      {/* 残りのカード... */}
    </div>
  </div>
</section>
```

### Stats Section

```jsx
<section className="py-16 sm:py-24 bg-gray-900">
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
      {/* Stat */}
      <div className="
        text-center
        transform transition-transform duration-350 ease-apple
        hover:scale-105
      ">
        <div className="font-mono text-title1 sm:text-largeTitle lg:text-[44px] font-bold text-sky mb-2">
          25
          <span className="text-title3 ml-1">名</span>
        </div>
        <div className="text-callout text-gray-400">
          チームメンバー
        </div>
      </div>
      
      {/* 残りのStats... */}
    </div>
  </div>
</section>
```

---

## 🎯 クイックリファレンス

### よく使うクラス組み合わせ

```jsx
// セクション
"py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"

// コンテナ
"max-w-screen-xl mx-auto"

// Apple風カード
"bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-350 ease-apple p-6"

// Primary CTA（SOARA）
"bg-gradient-soara text-white px-6 py-3 rounded-lg shadow-soara hover:shadow-sky transition-all duration-250 ease-apple font-semibold focus:ring-4 focus:ring-soara-300 focus:ring-offset-2 active:scale-[0.98]"

// 見出し
"text-title2 sm:text-title1 font-bold text-gray-900 mb-4"

// 本文
"text-body text-gray-600 leading-relaxed"

// グリッド
"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"

// フォーカスリング
"focus:outline-none focus:ring-4 focus:ring-soara-300 focus:ring-offset-2"
```

---

## 📝 デザイントークン（CSS変数）

```css
:root {
  /* SOARA Colors */
  --color-soara-400: #369bff;
  --color-soara-800: #0050a7;
  --color-sky: #00d4ff;
  
  /* Apple Grays */
  --color-gray-50: #f5f7fa;
  --color-gray-900: #0a0a0a;
  
  /* Spacing (8pt grid) */
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  
  /* Typography */
  --font-size-largeTitle: 34px;
  --font-size-body: 17px;
  
  /* Border Radius */
  --radius-lg: 12px;
  --radius-2xl: 20px;
  
  /* Shadows */
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-soara: 0 10px 40px -10px rgba(54, 155, 255, 0.3);
  
  /* Transitions */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --easing-apple: cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

---

## 🔍 重要な注意事項

### 1. 優先順位
- **カラー・ビジュアル**: SOARAブランドを最優先
- **レイアウト・インタラクション**: Apple HIG準拠
- **アクセシビリティ**: WCAG 2.1 AA必須

### 2. 必須ルール
- すべてのインタラクティブ要素に44px最小タッチターゲット
- WCAG AAコントラスト比を満たす色の組み合わせ
- フォーカスリングの明確な表示
- モーション削減対応

### 3. 推奨事項
- モバイルファーストでデザイン
- Apple風の控えめなアニメーション
- 8ptグリッドシステムの厳守
- セマンティックHTMLとARIA属性の使用

---

**このデザインシステムは、SOARAのブランドアイデンティティとAppleの洗練された美学を融合させた、統一感のある高品質なユーザー体験を実現します。**
