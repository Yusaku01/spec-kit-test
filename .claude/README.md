# Screenshot Capture Application - Custom Agent System

**70タスクを効率的に実行するための専門エージェントシステム**

## 🤖 エージェント概要

7つの専門エージェントがScreenshot Capture Applicationの実装を担当します。各エージェントは特定の技術領域に特化し、並列実行により大幅な時間短縮を実現します。

### エージェント一覧

| エージェント | 担当タスク | 専門領域 | 並列実行可能タスク |
|-------------|-----------|----------|-------------------|
| **setup-agent** | T001-T006 | Tauri初期化、環境構築 | 4タスク |
| **test-writer-agent** | T007-T024 | TDD契約テスト作成 | 18タスク |
| **rust-backend-agent** | T025-T045 | Rustバックエンド実装 | 15タスク |
| **react-frontend-agent** | T046-T056 | React UI実装 | 8タスク |
| **integration-agent** | T057-T061 | システム統合 | 順次実行 |
| **e2e-test-agent** | T062-T064 | Playwright E2Eテスト | 3タスク |
| **polish-agent** | T065-T070 | 最適化・品質向上 | 4タスク |

**合計**: 70タスク、52タスクが並列実行可能

## 🚀 使用方法

### 1. エージェント定義（完了済み）

```bash
# 各エージェントが.claude/agents/配下に定義済み
ls .claude/agents/
setup-agent.md
test-writer-agent.md  
rust-backend-agent.md
react-frontend-agent.md
integration-agent.md
e2e-test-agent.md
polish-agent.md
```

### 2. フェーズ実行

#### Phase 1: セットアップ（setup-agent）
```typescript
// T001-T006を実行
await Task({
  subagent_type: 'setup-agent',
  description: 'Initialize Tauri project',
  prompt: `あなたはsetup-agentです。
  
  以下のタスクを実行してください：
  - T001: Tauri project structure作成
  - T002: React + TypeScript + TailwindCSS初期化
  - T003-T006: 依存関係とビルド設定（並列実行）
  
  完了後、'cargo tauri dev'で起動可能な状態にしてください。
  
  参考資料:
  - /specs/001-react-js-tailwindcss/quickstart.md
  - /specs/001-react-js-tailwindcss/research.md`
});
```

#### Phase 2: TDDテスト作成（test-writer-agent）
```typescript
// T007-T024を大規模並列実行
await Task({
  subagent_type: 'test-writer-agent', 
  description: 'Create all contract tests',
  prompt: `あなたはtest-writer-agentです。

  TDD原則に従い、以下18個の契約テストを並列作成してください：
  
  **契約テスト（並列実行可能）:**
  - T007-T008: Permission management tests
  - T009-T011: App detection tests  
  - T012-T014: Session management tests
  - T015-T017: Capture control tests
  - T018-T021: Screenshot & settings tests
  
  **統合テスト（並列実行可能）:**
  - T022-T024: Integration workflow tests
  
  **重要**: 全テストは実装前に作成し、必ず失敗する状態で完了してください。
  
  参考資料:
  - /specs/001-react-js-tailwindcss/contracts/tauri-commands.ts
  - /specs/001-react-js-tailwindcss/contracts/rust-types.rs`
});
```

#### Phase 3: Rustバックエンド（rust-backend-agent）
```typescript
// T025-T045を段階的並列実行
await Task({
  subagent_type: 'rust-backend-agent',
  description: 'Implement Rust backend',
  prompt: `あなたはrust-backend-agentです。

  **Phase 3.3: データモデル（並列実行）:**
  - T025-T028: 4つのエンティティモデル
  
  **Phase 3.4: ライブラリ（並列実行）:** 
  - T029-T031: Screenshot library
  - T032-T035: Automation library
  - T036-T039: Storage library
  
  **Phase 3.5: Tauriコマンド（順次実行）:**
  - T040-T045: 25個のコマンドハンドラー
  
  契約テストがすべて失敗することを確認してから実装を開始してください。
  
  参考資料:
  - /specs/001-react-js-tailwindcss/data-model.md
  - /specs/001-react-js-tailwindcss/research.md
  - 失敗中の契約テスト`
});
```

#### Phase 4: Reactフロントエンド（react-frontend-agent）
```typescript
// T046-T056を並列実行
await Task({
  subagent_type: 'react-frontend-agent',
  description: 'Build React frontend',
  prompt: `あなたはreact-frontend-agentです。

  **UI コンポーネント（並列実行）:**
  - T046-T053: 8つのReactコンポーネント
  
  **サービス層（並列実行）:**
  - T054-T056: Tauriサービス、カスタムフック、イベントハンドラー
  
  React 18 + TypeScript + TailwindCSSで実装してください。
  全コンポーネントはレスポンシブデザインとアクセシビリティに対応してください。
  
  参考資料:
  - /specs/001-react-js-tailwindcss/contracts/tauri-commands.ts
  - Rustバックエンドの実装済みコマンド`
});
```

#### Phase 5: システム統合（integration-agent）
```typescript
// T057-T061を順次実行
await Task({
  subagent_type: 'integration-agent',
  description: 'System integration',
  prompt: `あなたはintegration-agentです。

  macOSシステム統合を実行してください：
  
  - T057: グローバルショートカット登録
  - T058: macOS権限リクエストフロー
  - T059: 構造化ログ設定
  - T060: エラーハンドリングシステム
  - T061: アプリケーションライフサイクル管理
  
  これらのタスクは相互依存があるため順次実行してください。
  
  参考資料:
  - /specs/001-react-js-tailwindcss/research.md (macOS API情報)`
});
```

#### Phase 6: E2Eテスト（e2e-test-agent）
```typescript
// T062-T064を並列実行
await Task({
  subagent_type: 'e2e-test-agent',
  description: 'E2E testing with Playwright',
  prompt: `あなたはe2e-test-agentです。

  Playwright E2Eテストを並列作成してください：
  
  - T062: 完全キャプチャワークフローテスト
  - T063: 権限ハンドリングテスト  
  - T064: 設定管理テスト
  
  Page Object Modelを使用し、実際のTauriアプリケーションと統合してください。
  
  参考資料:
  - /specs/001-react-js-tailwindcss/contracts/playwright-tests.ts
  - 完成したアプリケーション`
});
```

#### Phase 7: 品質向上（polish-agent）
```typescript
// T065-T070を最終実行
await Task({
  subagent_type: 'polish-agent',
  description: 'Final polish and optimization',
  prompt: `あなたはpolish-agentです。

  最終品質向上を実行してください：
  
  **並列実行可能:**
  - T065: 単体テスト
  - T066: パフォーマンステスト（<100ms screenshot, <200MB memory）
  - T067: README.md更新
  - T068: ライブラリドキュメント生成
  
  **順次実行:**
  - T069: コード重複排除とリファクタリング
  - T070: quickstart.md手動検証
  
  参考資料:
  - /specs/001-react-js-tailwindcss/quickstart.md
  - 完成したアプリケーション`
});
```

## ⚡ 並列実行の最大化

### 同時実行可能フェーズ

#### Phase 2: 契約テスト（18並列）
```typescript
// 全契約テストを同時作成
const contractTests = [
  'test_permissions.rs',
  'test_app_detection.rs', 
  'test_session_management.rs',
  'test_capture_control.rs',
  'test_screenshot_management.rs',
  'test_settings.rs',
  'test_legal.rs'
];
// + integration tests (3ファイル)
// = 合計21個のテストファイルを並列作成
```

#### Phase 3: Rustモデル（4並列）+ ライブラリ（11並列）
```typescript
// データモデル4個を並列作成
const models = ['screenshot.rs', 'book_session.rs', 'app_target.rs', 'capture_settings.rs'];

// その後ライブラリ11個を並列作成  
const libraries = [
  'screenshot/capture.rs', 'screenshot/fallback.rs', 'screenshot/cli.rs',
  'automation/accessibility.rs', 'automation/keyboard.rs', 'automation/window.rs', 'automation/cli.rs',
  'storage/filesystem.rs', 'storage/database.rs', 'storage/session.rs', 'storage/cli.rs'
];
```

#### Phase 4: Reactコンポーネント（8並列）
```typescript
// UIコンポーネント8個を並列作成
const components = [
  'AppShell.tsx', 'PermissionDialog.tsx', 'AppDetectionPage.tsx',
  'CaptureControls.tsx', 'ProgressIndicator.tsx', 'SessionSummary.tsx', 
  'SettingsPage.tsx', 'ShortcutsConfig.tsx'
];
```

## 📊 予想実行時間

| フェーズ | 順次実行 | 並列実行 | 時間短縮 |
|---------|---------|---------|---------|
| Phase 1: Setup | 3時間 | 2時間 | 33% |
| Phase 2: Tests | 9時間 | 2時間 | 78% |
| Phase 3: Backend | 10時間 | 4時間 | 60% |
| Phase 4: Frontend | 6時間 | 2時間 | 67% |
| Phase 5: Integration | 3時間 | 3時間 | 0% |
| Phase 6: E2E | 3時間 | 1時間 | 67% |
| Phase 7: Polish | 4時間 | 2時間 | 50% |
| **合計** | **38時間** | **16時間** | **58%** |

## 🎯 成功基準

### Phase完了チェックリスト

#### ✅ Phase 1 完了
- [ ] `cargo tauri dev`で起動可能
- [ ] 全依存関係インストール済み
- [ ] TypeScript設定完了
- [ ] TailwindCSS適用済み

#### ✅ Phase 2 完了  
- [ ] 21個の契約テスト作成完了
- [ ] `cargo test`実行でテスト失敗確認
- [ ] TypeScript型定義との整合性確認

#### ✅ Phase 3 完了
- [ ] 4つのデータモデル実装完了
- [ ] 11個のライブラリ実装完了
- [ ] 25個のTauriコマンド実装完了
- [ ] 契約テスト全てパス

#### ✅ Phase 4 完了
- [ ] 8つのReactコンポーネント完了
- [ ] Tauriサービス統合完了
- [ ] レスポンシブデザイン確認

#### ✅ Phase 5 完了
- [ ] グローバルショートカット動作確認
- [ ] macOS権限フロー動作確認
- [ ] エラーハンドリング検証完了

#### ✅ Phase 6 完了
- [ ] 3つのE2Eテストパス
- [ ] 実際のアプリケーション動作確認

#### ✅ Phase 7 完了
- [ ] パフォーマンス目標達成（<100ms, <200MB）
- [ ] ドキュメント更新完了
- [ ] コード品質目標達成

## 🚨 注意事項

### TDD原則の厳守
**Phase 2のテストは必ず実装前に作成し、失敗状態で完了する必要があります。**

### 依存関係の管理
- Phase 1完了後にPhase 2実行
- Phase 2完了後にPhase 3-4並列実行可能
- Phase 5はPhase 3-4完了後
- Phase 6-7はすべて完了後

### エージェント間の情報共有
各エージェントは独立したコンテキストで動作するため：
- 重要な設定は仕様書に記録
- ファイル作成後は他エージェントが参照可能
- エラーや問題は明確にログ出力

## 🎊 実行開始

エージェントシステムの準備が完了しました！

**次の手順:**
1. Phase 1から順次実行
2. 各Phase完了後に成功基準をチェック
3. 問題があれば該当エージェントを再実行
4. 最終的に70タスク完了でアプリケーション完成

**予想総実行時間: 16時間（並列実行活用時）**

がんばってください！🚀