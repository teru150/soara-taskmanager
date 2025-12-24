# SOARA Task Management System - Requirements Document

## Project Overview

### Purpose
SOARA（高校生ボランティアチーム）が2026年鳥人間コンテスト出場に向けて、技術開発・資金調達・渉外活動などの複雑なプロジェクトを効率的に管理するためのタスク管理システム。

### Target Users
- 代表・副代表（全体統括）
- 部門リーダー（技術・資金調達・広報など）
- 一般メンバー（約25名、日本の複数高校 + アメリカ）
- 協力者・ゲスト（大学チーム、スポンサー候補など）

### Key Objectives
- 分散チームの活動を一元管理
- 2026年2月の設計書提出期限に向けた進捗可視化
- 200-600万円の予算管理
- 日英バイリンガル対応

---

## Core Features

### 1. Task Management

#### 1.1 Task CRUD Operations
- タスクの作成・編集・削除・複製
- タイトル（必須）
- 詳細説明（Markdown対応）
- サブタスク機能（チェックリスト）

#### 1.2 Task Attributes
- **ステータス**: 未着手 / 進行中 / レビュー待ち / 完了 / 保留 / キャンセル
- **優先度**: 緊急 / 高 / 中 / 低
- **期限**: 開始日・終了日（必須/任意選択可能）
- **担当者**: 複数アサイン可能
- **カテゴリー**: 
  - 技術開発（設計・解析・製造・試験）
  - 資金調達（スポンサー営業・助成金申請）
  - 渉外（大学連携・施設交渉）
  - 広報（SNS・Web・メディア対応）
  - 運営（会議・総務・メンバー管理）
- **タグ**: 自由設定（例: #CFRP #XFLR5 #スポンサー提案書 #TIB）
- **予算**: 見積額・実費額の入力

#### 1.3 Task Relationships
- 依存関係設定（タスクA完了後にタスクB開始）
- 親子関係（大タスク→サブタスク）
- 関連タスクのリンク

---

### 2. Collaboration Features

#### 2.1 Communication
- タスクごとのコメントスレッド
- @メンション機能（通知トリガー）
- リアクション（👍 ✅ 🔥 など）
- ファイル添付（設計図PDF、計算書Excel、提案書など）
  - 最大ファイルサイズ: 50MB/ファイル
  - 対応形式: PDF, DOCX, XLSX, PNG, JPG, SVG, ZIP

#### 2.2 Activity Log
- 誰が何をいつ変更したかの履歴
- フィルタリング（ユーザー別・アクション別）
- エクスポート機能（CSV）

---

### 3. Visualization & Views

#### 3.1 List View
- テーブル形式での一覧表示
- ソート（期限・優先度・担当者など）
- フィルタリング（複数条件の組み合わせ）
- 一括操作（選択タスクのステータス変更など）
- 列のカスタマイズ（表示/非表示切り替え）

#### 3.2 Kanban Board
- ステータスごとの列（Drag & Drop対応）
- スイムレーン（担当者別・カテゴリー別に分割表示）
- WIP制限設定（1列あたりの最大タスク数）
- カード上での簡易編集

#### 3.3 Interactive Gantt Chart
- **ドラッグ操作**:
  - タスクバーの長さ変更で期限調整
  - タスクバーの移動で開始日・終了日をシフト
  - 依存関係の矢印をドラッグして接続
- **表示制御**:
  - ズームレベル（日・週・月・四半期）
  - クリティカルパス表示
  - マイルストーンマーカー
  - 今日線（Today Line）
- **データ表示**:
  - タスク名・担当者・進捗率
  - 期限超過タスクの色分け（赤）
  - バッファ期間の可視化
- **インタラクション**:
  - タスククリックで詳細パネル表示
  - 右クリックメニュー（編集・削除・複製）
  - 範囲選択での一括操作

#### 3.4 Calendar View
- 月/週/日表示切り替え
- タスクのドラッグ＆ドロップでスケジュール変更
- Googleカレンダー同期（オプション）
- 期限・会議・マイルストーンの統合表示

#### 3.5 Timeline View
- プロジェクト全体の時系列表示
- カテゴリー別の並行作業可視化
- フェーズ区切り（企画・設計・製造・試験・本番）

---

### 4. Dashboard & Analytics

#### 4.1 Overview Dashboard
- **進捗メトリクス**:
  - 全体完了率（完了タスク数/総タスク数）
  - カテゴリー別進捗率
  - マイルストーン達成状況
- **アラート**:
  - 期限24時間以内のタスク
  - 期限超過タスク
  - 担当者未設定のタスク
  - 予算超過リスク
- **チャート**:
  - バーンダウンチャート
  - タスク完了トレンド（週次）
  - カテゴリー別作業量分布（円グラフ）

#### 4.2 Budget Tracking
- カテゴリー別予算使用状況
- 見積vs実費の比較
- 目標200-600万円に対する進捗バー
- 支出履歴タイムライン

#### 4.3 Member Workload
- メンバー別タスク数・作業時間
- 負荷バランスの可視化（誰に偏っているか）
- 完了率ランキング（モチベーション向上）

---

### 5. Milestone Management

#### 5.1 Critical Milestones
- **2026年2月**: 設計書提出
- **2025年12月**: 設計書初稿完成
- **2026年3-5月**: 製造フェーズ
- **2026年6月**: テストフライト
- **2026年7月**: 鳥人間コンテスト本番

#### 5.2 Milestone Features
- マイルストーン達成条件（紐付きタスク全完了）
- 達成時の自動通知
- 遅延リスク警告（関連タスクの進捗遅れ）

---

### 6. User Management & Permissions

#### 6.1 User Roles
- **管理者**（代表・副代表）: 全機能アクセス
- **リーダー**（部門長）: 担当カテゴリーの完全編集権限
- **メンバー**: タスク作成・編集・コメント
- **ゲスト**: 指定タスクの閲覧・コメントのみ

#### 6.2 Access Control
- タスクごとの公開範囲設定（全員/特定メンバー/リーダー以上）
- プロジェクト全体の閲覧制限
- 予算情報へのアクセス制限（管理者・財務担当のみ）

---

### 7. Notifications

#### 7.1 Notification Triggers
- タスク割り当て
- @メンション
- 期限3日前・1日前・当日
- コメント返信
- ステータス変更（自分が担当/作成したタスク）

#### 7.2 Notification Channels
- アプリ内通知（ベルアイコン）
- メール通知（設定でON/OFF可能）
- Slack/Discord Webhook連携（オプション）

---

### 8. Internationalization

#### 8.1 Language Support
- 日本語（デフォルト）
- 英語（アメリカメンバー向け）
- ユーザーごとの言語設定

#### 8.2 Date/Time Localization
- タイムゾーン対応（JST基準、UTCで管理）
- 日付フォーマット（YYYY/MM/DD vs MM/DD/YYYY）

---

### 9. Data Management

#### 9.1 Import/Export
- **エクスポート**:
  - CSV（タスクリスト）
  - JSON（バックアップ）
  - PDF（ガントチャート印刷）
- **インポート**:
  - CSV（一括タスク登録）
  - Googleスプレッドシート連携

#### 9.2 Search & Filter
- 全文検索（タスク名・説明・コメント）
- 高度なフィルター（AND/OR条件）
- 検索条件の保存（ブックマーク機能）

---

### 10. Mobile & Offline Support

#### 10.1 Progressive Web App (PWA)
- インストール可能
- プッシュ通知対応
- レスポンシブデザイン（スマホ・タブレット最適化）

#### 10.2 Offline Functionality
- オフライン時の閲覧（キャッシュ）
- オフライン時の編集（同期キュー）
- ネットワーク復帰時の自動同期
- コンフリクト解決UI

---

## Technical Requirements

### Technology Stack

#### Frontend
- **Framework**: React 18+ with TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand or React Query
- **Gantt Chart**: react-gantt-chart or custom D3.js implementation
- **Calendar**: FullCalendar or react-big-calendar
- **Drag & Drop**: @dnd-kit/core

#### Backend & Database
- **BaaS**: Firebase or Supabase
- **Authentication**: Email/Password + Google OAuth
- **Database**: Firestore (NoSQL) or PostgreSQL (Supabase)
- **File Storage**: Firebase Storage or Supabase Storage
- **Real-time Sync**: Firestore listeners or Supabase Realtime

#### Deployment
- **Hosting**: Vercel or Netlify
- **CI/CD**: GitHub Actions
- **Domain**: soara.jp/tasks または tasks.soara.jp

### Performance Requirements
- 初回ロード: 3秒以内
- タスク検索: 1秒以内（1000件まで）
- ガントチャート描画: 2秒以内（500タスクまで）
- リアルタイム更新遅延: 500ms以内

### Security Requirements
- HTTPS必須
- JWT認証
- XSS対策（サニタイゼーション）
- CSRF対策
- ファイルアップロード検証（MIME type, サイズ）
- 個人情報の暗号化保存

---

## Development Phases

### Phase 1: MVP (4-6 weeks)
- 基本タスクCRUD
- List View
- 簡易Kanban Board
- ユーザー認証
- 日英切り替え

### Phase 2: Core Features (4-6 weeks)
- Interactive Gantt Chart
- Calendar View
- コメント・通知機能
- ファイル添付
- Dashboard基本版

### Phase 3: Advanced Features (4-6 weeks)
- 予算管理
- マイルストーン管理
- 高度なフィルタリング
- PWA化
- オフライン対応

### Phase 4: Polish & Optimization (2-4 weeks)
- パフォーマンス最適化
- モバイルUI改善
- 外部連携（Slack等）
- ユーザーフィードバック反映

---

## Success Metrics

### Adoption
- アクティブユーザー率: 80%以上（25名中20名）
- 週次ログイン率: 60%以上

### Productivity
- タスク完了率: 前月比20%向上
- 期限遵守率: 75%以上
- コミュニケーション時間削減: 30%

### User Satisfaction
- NPS (Net Promoter Score): 50以上
- ユーザーアンケート満足度: 4.0/5.0以上

---

## Risks & Mitigation

### Technical Risks
- **リアルタイム同期のパフォーマンス低下**
  - 対策: ページネーション、仮想スクロール
- **ガントチャート描画の重さ**
  - 対策: タスク数制限、遅延ロード

### Organizational Risks
- **メンバーの習熟度バラつき**
  - 対策: チュートリアル動画、オンボーディングガイド
- **移行期の二重管理**
  - 対策: 段階的移行、データインポート支援

---

## Appendix

### Glossary
- **WIP (Work In Progress)**: 進行中タスク
- **Critical Path**: 遅延が全体工程に影響するタスク連鎖
- **Burndown Chart**: 残タスク減少推移グラフ

### References
- [SOARA公式](https://soarahpa.com)
- Firebase Documentation
- shadcn/ui Components