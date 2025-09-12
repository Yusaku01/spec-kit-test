---
description: "Git運用ルールとPR・ブランチ操作の流れを提供するガイドコマンド"
allowed-tools: ["Read", "Bash"]
---

# Git Workflow Guide

Claude Code Actions がタスクを実行する際に参照する Git 運用ルールとワークフローガイドです。

## 使用方法

```bash
/git-workflow-guide [オプション]
```

## オプション

- `--branch-rules`: ブランチ命名規則とブランチ操作フロー
- `--pr-rules`: PR 作成・運用ルール
- `--commit-rules`: コミット運用ルール
- `--all`: 全ての運用ルールを表示（デフォルト）

## 使用例

```bash
# 全ての運用ルールを表示
/git-workflow-guide

# ブランチ運用ルールのみ
/git-workflow-guide --branch-rules

# PR運用ルールのみ
/git-workflow-guide --pr-rules
```

---

引数: $ARGUMENTS

## Git 運用ルール

### ブランチ命名規則

#### 基本パターン

```
<type>/<description>
<type>/<issue-number>-<description>
```

#### ブランチタイプ

- `feature/`: 新機能開発
- `fix/`: バグ修正
- `hotfix/`: 緊急修正
- `docs/`: ドキュメント更新
- `refactor/`: リファクタリング
- `style/`: UI 修正
- `test/`: テスト改善

#### 命名例

```
feature/user-authentication
fix/login-validation-bug
hotfix/security-vulnerability
docs/api-documentation
refactor/database-optimization
style/ui-improvement
test/test-improvement
```

### GitHub Flow ワークフロー

#### 1. 新しいブランチの作成

```bash
# mainブランチから最新の状態を取得
git checkout main
git pull origin main

# 新しいブランチを作成
git checkout -b feature/your-feature-name
```

#### 2. 開発作業

```bash
# 変更を追加
git add .

# コミット（Conventional Commits準拠）
git commit -m "feat: add user authentication feature"

# リモートにプッシュ
git push -u origin feature/your-feature-name
```

#### 3. PR 作成

```bash
# GitHub CLIを使用してPR作成
gh pr create --title "feat: add user authentication feature" --body "$(cat <<'EOF'
## 概要
ユーザー認証機能を追加

## 変更内容
- JWT トークンベースの認証を実装
- ログイン・ログアウト機能を追加
- 認証ミドルウェアを作成

## 動作確認
- [ ] 単体テストの実行
- [ ] 結合テストの実行
- [ ] 手動テストの実行

## 関連Issue
Closes #123
EOF
)"
```

#### 4. PR 承認後のマージ

```bash
# PR承認後、mainブランチに戻る
git checkout main
git pull origin main

# 作業ブランチを削除
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

### コミット運用ルール

#### Conventional Commits 準拠

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### コミットタイプ

- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントの変更
- `style`: コードスタイルの変更（機能に影響しない）
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

#### コミット例

```bash
feat(auth): add JWT token authentication
fix(login): resolve validation error handling
docs(readme): update installation instructions
refactor(utils): simplify error handling logic
test(auth): add unit tests for login function
chore(deps): update dependency versions
```

### PR 運用ルール

#### PR テンプレート必須項目

```markdown
## 概要

<!-- 変更内容の概要を簡潔に記載 -->

## 変更内容

<!-- 具体的な変更内容をリスト形式で記載 -->

-
-
-

## 動作確認

<!-- テスト方法や確認手順を記載 -->

- [ ] 単体テストの実行
- [ ] 結合テストの実行
- [ ] 手動テストの実行

## 関連 Issue

<!-- 関連するIssueがある場合は記載 -->

Closes #xxx

## 備考

<!-- その他の注意事項や補足情報 -->
```

#### PR サイズガイドライン

- **変更行数の目安**: 100-400 行
- **レビュー時間の目安**: 10-30 分
- **原則**: 1 つの PR で 1 つの機能や修正に集中

#### レビュー観点

- [ ] 機能要件を満たしているか
- [ ] コードの可読性・保守性
- [ ] セキュリティ上の問題はないか
- [ ] パフォーマンスへの影響
- [ ] テストの網羅性
- [ ] ドキュメントの更新

### 具体的な作業フロー

#### 新機能開発の場合

```bash
# 1. 最新のmainブランチから開始
git checkout main && git pull origin main

# 2. 機能ブランチを作成
git checkout -b feature/new-feature

# 3. 開発・テスト・コミット
git add . && git commit -m "feat: implement new feature"

# 4. リモートにプッシュ
git push -u origin feature/new-feature

# 5. PR作成（GitHub CLI）
gh pr create --title "feat: implement new feature" --body "新機能の実装"

# 6. レビュー・承認後、マージ
# 7. ブランチクリーンアップ
git checkout main && git pull origin main
git branch -d feature/new-feature
```

#### バグ修正の場合

```bash
# 1. 最新のmainブランチから開始
git checkout main && git pull origin main

# 2. 修正ブランチを作成
git checkout -b fix/bug-description

# 3. バグ修正・テスト・コミット
git add . && git commit -m "fix: resolve bug in login validation"

# 4. リモートにプッシュ
git push -u origin fix/bug-description

# 5. PR作成（緊急性に応じて）
gh pr create --title "fix: resolve bug in login validation" --body "ログイン検証のバグを修正"
```

#### 緊急修正（hotfix）の場合

```bash
# 1. 最新のmainブランチから開始
git checkout main && git pull origin main

# 2. hotfixブランチを作成
git checkout -b hotfix/critical-security-fix

# 3. 緊急修正・テスト・コミット
git add . && git commit -m "hotfix: patch critical security vulnerability"

# 4. リモートにプッシュ
git push -u origin hotfix/critical-security-fix

# 5. 緊急PR作成
gh pr create --title "hotfix: patch critical security vulnerability" --body "セキュリティ脆弱性の緊急修正"
```

## Claude Code Actions 向けの指示

### 作業開始時の確認事項

1. **現在のブランチ状態**: `git status` で確認
2. **最新の main ブランチ**: `git checkout main && git pull origin main`
3. **適切なブランチ名**: 命名規則に従ったブランチ名を使用

### 作業完了時の必須作業

1. **適切なコミットメッセージ**: Conventional Commits 準拠
2. **PR 作成**: テンプレートに従った内容
3. **関連 Issue のクローズ**: `Closes #issue-number`
4. **ブランチクリーンアップ**: 作業完了後の不要ブランチ削除

### 注意事項

- **main ブランチへの直接コミット禁止**
- **未完了の作業は適切にコミット**
- **プッシュ前にローカルテストを実行**
- **PR 作成時は必ずテンプレートを使用**

このガイドに従って、一貫性のある Git 運用を実現してください。
