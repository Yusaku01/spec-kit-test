---
description: "既存のClaudeカスタムコマンドを編集・改善するコマンド"
allowed-tools: ["Read", "Edit", "Write", "Bash"]
---

# Refactor Commands

このコマンドは既存のClaudeカスタムコマンドを編集・改善するためのツールです。

## 使用方法

```bash
/refactor-commands [コマンド名] [改善タイプ] [詳細指定]
```

## 引数

- `[コマンド名]`: 編集するコマンドの名前（必須）
- `[改善タイプ]`: 改善の種類（structure/logic/documentation/optimization、オプション、デフォルト: "optimization"）
- `[詳細指定]`: 具体的な改善内容の指定（オプション）

## 改善タイプ

- `structure`: コマンドの構造とフォーマットを改善
- `logic`: 実装ロジックの最適化と効率化
- `documentation`: ドキュメントの充実と例の追加
- `optimization`: 全体的な最適化と改善提案

## 例

```bash
# 基本的なコマンド最適化
/refactor-commands use-subagents

# 構造の改善
/refactor-commands article-reviews structure

# ロジックの最適化
/refactor-commands gemini-search logic

# ドキュメントの改善
/refactor-commands create-commands documentation

# 具体的な改善指定
/refactor-commands use-subagents optimization "引数処理の改善とエラーハンドリングの強化"
```

---

既存のClaudeカスタムコマンドを編集・改善します。引数: $ARGUMENTS

引数を解析してコマンドの改善を実行します：

**引数解析:**
- コマンド名: 第1引数（必須）
- 改善タイプ: 第2引数（オプション、デフォルト: "optimization"）
- 詳細指定: 第3引数以降（オプション）

**改善プロセス:**
1. 指定されたコマンドファイルの存在確認
2. 現在のコマンド内容の読み込みと分析
3. 改善タイプに応じた分析と提案
4. バックアップの作成
5. 改善の実装
6. 変更内容の確認と検証

**分析項目:**
- frontmatter設定の最適化
- ドキュメント構造の改善
- 引数処理の効率化
- エラーハンドリングの強化
- 使用例の充実
- 実装ロジックの最適化

**改善提案の種類:**

**Structure（構造）:**
- frontmatter設定の最適化
- ドキュメント構造の標準化
- セクション構成の改善
- フォーマットの統一

**Logic（ロジック）:**
- 引数処理の効率化
- エラーハンドリングの強化
- パフォーマンスの最適化
- 実装の簡素化

**Documentation（ドキュメント）:**
- 使用例の追加
- 説明の詳細化
- 引数説明の改善
- ベストプラクティスの追加

**Optimization（最適化）:**
- 全体的なコードレビュー
- 包括的な改善提案
- 複数の改善要素の組み合わせ
- 将来的な拡張性の考慮

**実行内容:**
1. コマンドファイルの読み込み
2. 現在の実装の詳細分析
3. 改善箇所の特定と提案
4. 実際の改善実装
5. 改善後のテストと検証

このコマンドにより、既存のカスタムコマンドを継続的に改善し、より効率的で使いやすいものにすることができます。