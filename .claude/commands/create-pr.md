---
description: "Git運用ルールに従ってPRを自動作成するコマンド"
allowed-tools: ["Bash", "Read"]
---

# Create PR

Git 運用ルールに従って、適切なフォーマットで PR を自動作成するコマンドです。

以下のようなメッセージは載せないでください。

```
🤖 Generated with Claude Code
(claude.ai/code)"--label "documentation,enhancement"
PRを作成
```

## 使用方法

```bash
/create-pr <タイトル> [オプション]
```

## 引数

- `<タイトル>`: PR のタイトル（Conventional Commits 準拠推奨）

## オプション

- `--body <内容>`: PR の詳細説明
- `--issue <番号>`: 関連する Issue 番号
- `--draft`: ドラフト PR として作成
- `--reviewer <ユーザー名>`: レビュアーを指定
- `--label <ラベル>`: 追加ラベルを指定
- `--base <ブランチ>`: ベースブランチを指定（デフォルト: main）
- `--interactive`: インタラクティブモードで詳細を入力

## 使用例

```bash
# 基本的なPR作成
/create-pr "feat(auth): implement JWT authentication"

# Issue番号を指定
/create-pr "fix(login): resolve validation error" --issue 123

# ドラフトPRとして作成
/create-pr "feat: new feature implementation" --draft

# レビュアーを指定
/create-pr "refactor(utils): improve error handling" --reviewer username

# インタラクティブモードで詳細入力
/create-pr "feat(api): add user endpoints" --interactive

# カスタムベースブランチ
/create-pr "hotfix: critical security patch" --base develop
```

## 機能詳細

### 1. Conventional Commits 準拠チェック

- タイトルが Conventional Commits 形式かを自動検証
- 適切でない場合は修正提案を表示

### 2. 自動テンプレート適用

- 作成済みの PR テンプレートを自動適用
- ブランチ情報やコミット履歴から内容を推測

### 3. 適切なラベル設定

- タイトルの type に基づいて自動ラベル設定
- feat → feature, fix → bug など

### 4. Git 情報の自動取得

- 現在のブランチ名
- 最近のコミット履歴
- 変更ファイル数

---

引数: $ARGUMENTS

## PR 作成実行

Git 運用ルールに従った PR 作成を開始します。

### Phase 1: 環境確認と引数解析

まず、環境と引数の確認を行います。

**引数解析を実行します:**

**環境確認を実行します:**

- Git リポジトリかどうかの確認
- GitHub CLI (gh) の存在と認証確認
- 現在のブランチ情報の取得

### Phase 2: タイトル検証

**Conventional Commits 準拠チェックを実行します:**

Conventional Commits 形式のパターン検証：

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: フォーマット
- `refactor`: リファクタリング
- `test`: テスト
- `chore`: その他

形式: `<type>[optional scope]: <description>`

### Phase 3: ラベル自動設定

**タイトルの type に基づいてラベルを自動設定します:**

- `feat*` → `feature,enhancement`
- `fix*` → `bug,fix`
- `docs*` → `documentation`
- `refactor*` → `refactor`
- `test*` → `test`
- `chore*` → `chore`
- `perf*` → `performance`
- `ci*|build*` → `ci`
- `hotfix*` → `hotfix,urgent`

### Phase 4: PR 本文生成

**PR テンプレートを使用して本文を生成します:**

既存の `.github/pull_request_template.md` を活用し、以下の情報を自動設定：

- 関連 Issue 番号の自動挿入
- ブランチ情報の反映
- コミット履歴からの変更内容推測

### Phase 5: PR 作成実行

**GitHub CLI (gh) を使用して PR を作成します:**

以下のコマンドを実行：

```bash
gh pr create \
  --title "タイトル" \
  --body "本文" \
  --base "ベースブランチ" \
  --label "ラベル" \
  [その他のオプション]
```

### Phase 6: 結果レポート

**作成結果と次のステップを表示します:**

- PR URL
- 設定されたラベル
- レビュアー情報
- 次のアクション提案

## 実装コード

実際の PR 作成処理を実行します：

**Step 1: 引数解析**

```bash
args=($ARGUMENTS)
prTitle="${args[0]}"
prBody=""
issueNumber=""
isDraft=false
reviewer=""
customLabels=""
baseBranch="main"
interactive=false

# 引数チェック
if [ -z "$prTitle" ]; then
    echo "エラー: PRタイトルが指定されていません"
    echo "使用方法: /create-pr \"<タイトル>\" [オプション]"
    exit 1
fi

# オプション解析
for i in "${!args[@]}"; do
    case "${args[i]}" in
        --body) prBody="${args[i+1]}" ;;
        --issue) issueNumber="${args[i+1]}" ;;
        --draft) isDraft=true ;;
        --reviewer) reviewer="${args[i+1]}" ;;
        --label) customLabels="${args[i+1]}" ;;
        --base) baseBranch="${args[i+1]}" ;;
        --interactive) interactive=true ;;
    esac
done
```

**Step 2: 環境確認**

```bash
# Gitリポジトリ確認
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "エラー: Gitリポジトリではありません"
    exit 1
fi

# GitHub CLI確認
if ! command -v gh &> /dev/null; then
    echo "エラー: GitHub CLI (gh) が見つかりません"
    echo "インストール: https://cli.github.com/"
    exit 1
fi

# 認証確認
if ! gh auth status &> /dev/null; then
    echo "エラー: GitHub CLIが未認証です"
    echo "認証: gh auth login"
    exit 1
fi
```

**Step 3: ブランチ情報取得**

```bash
currentBranch=$(git rev-parse --abbrev-ref HEAD)
latestCommit=$(git log -1 --pretty=format:"%h - %s")
commitCount=$(git rev-list --count HEAD ^$baseBranch 2>/dev/null || echo "1")
changedFiles=$(git diff --name-only $baseBranch..HEAD 2>/dev/null | wc -l)

echo "ブランチ: $currentBranch"
echo "コミット数: $commitCount"
echo "変更ファイル: $changedFiles"
```

**Step 4: Conventional Commits 検証**

```bash
pattern="^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+"
if [[ ! "$prTitle" =~ $pattern ]]; then
    echo "警告: Conventional Commits形式ではありません"
    echo "推奨: <type>[scope]: <description>"
    echo "続行しますか？ (y/N)"
    read -r confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        exit 1
    fi
fi
```

**Step 5: ラベル設定**

```bash
case "$prTitle" in
    feat*) labels="feature,enhancement" ;;
    fix*) labels="bug,fix" ;;
    docs*) labels="documentation" ;;
    refactor*) labels="refactor" ;;
    test*) labels="test" ;;
    chore*) labels="chore" ;;
    perf*) labels="performance" ;;
    ci*|build*) labels="ci" ;;
    hotfix*) labels="hotfix,urgent" ;;
    *) labels="enhancement" ;;
esac

if [ -n "$customLabels" ]; then
    labels="$labels,$customLabels"
fi
```

**Step 6: PR 本文生成**

```bash
if [ -z "$prBody" ]; then
    if [ -f ".github/pull_request_template.md" ]; then
        prBody=$(cat .github/pull_request_template.md)
        if [ -n "$issueNumber" ]; then
            prBody=$(echo "$prBody" | sed "s/Closes #$/Closes #$issueNumber/")
        fi
    else
        prBody="## 概要
<!-- 変更内容の概要 -->

## 変更内容
-

## 動作確認
- [ ] テスト実行

## 関連Issue
$([ -n "$issueNumber" ] && echo "Closes #$issueNumber" || echo "Closes #")

## 備考
<!-- 補足情報 -->"
    fi
fi
```

**Step 7: PR 作成**

```bash
echo "PR作成中..."
echo "タイトル: $prTitle"
echo "ラベル: $labels"

prCommand="gh pr create --title \"$prTitle\" --body \"$prBody\" --base \"$baseBranch\""

if [ -n "$labels" ]; then
    prCommand="$prCommand --label \"$labels\""
fi

if [ -n "$reviewer" ]; then
    prCommand="$prCommand --reviewer \"$reviewer\""
fi

if [ "$isDraft" = true ]; then
    prCommand="$prCommand --draft"
fi

echo "PRを作成しますか？ (Y/n)"
read -r confirm
if [ "$confirm" != "n" ] && [ "$confirm" != "N" ]; then
    if eval "$prCommand"; then
        echo "✅ PR作成完了"
        prUrl=$(gh pr view --json url --jq '.url' 2>/dev/null)
        [ -n "$prUrl" ] && echo "URL: $prUrl"

        echo "ブラウザで開きますか？ (y/N)"
        read -r openBrowser
        if [ "$openBrowser" = "y" ] || [ "$openBrowser" = "Y" ]; then
            gh pr view --web
        fi
    else
        echo "❌ PR作成失敗"
        exit 1
    fi
else
    echo "PR作成をキャンセル"
fi
```

**Step 8: 結果レポート**

```bash
echo ""
echo "=== PR作成完了 ==="
echo "次のステップ:"
echo "1. CI/CDチェック確認"
echo "2. レビュー依頼"
echo "3. PR説明の追記（必要に応じて）"
echo ""
echo "便利なコマンド:"
echo "- PR一覧: gh pr list"
echo "- PR詳細: gh pr view"
echo "- PRマージ: gh pr merge --squash"
```

## エラーハンドリング

### 入力検証エラー

- PR タイトル未指定
- 無効なオプション
- GitHub CLI 未認証

### Git 操作エラー

- 非 Git リポジトリ
- リモート接続エラー
- ブランチ不存在

### GitHub API エラー

- 権限不足
- 同名 PR 存在
- ネットワークエラー

## 高度な機能

### インタラクティブモード

`--interactive` で詳細情報を対話入力

### テンプレート自動適用

`.github/pull_request_template.md` の自動使用

### ラベル自動設定

Conventional Commits タイプベースの自動ラベル

このコマンドにより、Git 運用ルールに完全準拠した PR を効率的に作成できます。
