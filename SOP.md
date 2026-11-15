# 輕量教育訓練平台 — 開發與驗證 SOP

## 規格對齊狀態（2026-11-16）

- ✅ `PRD/SPEC.md` v4.0 依 `main`（`75038f9`）程式重建；`GOAL.md` 定義 M1。
- ⚠️ 本次只重建文件，尚未依 v4.0 開發。
- ⚠️ 本機無法執行 node：下表所有指令**未在本機執行**，結果欄只引用 GitHub Actions 紀錄。

## 環境

```bash
npm ci        # 使用 package-lock.json；repo 另有未使用的 pnpm-lock.yaml（M1 刪除）
```

Node 版本未在 repo 固定（無 `.nvmrc`、無 `engines`）；CI 用 Node 20。

## 驗證指令（依 `package.json` scripts 查證）

| 類型 | 指令 | 狀態 | 最近證據 |
|---|---|---|---|
| Install | `npm ci` | 可用 | CI 2026-09-07 成功 |
| Lint | `npm run lint`（`next lint`） | 可用但無 ESLint 設定 | CI lint job ✓，但設 `continue-on-error`，不代表通過 |
| Typecheck | `npm run typecheck`（`tsc --noEmit`） | 可用 | CI 未執行；未在本機執行 |
| Unit test | `npm test` | **尚未配置**（無 test script、無測試檔） | CI test job 以 `\|\| echo` 吞掉錯誤 |
| Build | `npm run build` | 可用 | CI build ✓（`continue-on-error`） |
| Dev | `npm run dev` | 可用 | 未在本機執行 |
| E2E | `npm run e2e` | **尚未配置** | M1 AC-001 新增 |
| Format | — | **尚未配置** | — |

M1 完成時下列指令須全部 exit 0：

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run e2e
```

## CI 現況

- lint、build `continue-on-error: true`；test `|| echo "no test script"`：**失敗不會讓 CI 失敗**。
- deploy job 走 GitHub Pages（上傳 `dist/`，Next 不產生）；2026-09-07 run `34071906860` 的 deploy 在 `configure-pages` 失敗。
- 以上在 M1 AC-001 修正；本次文件 PR 不改 CI。

## M1 開發流程

1. 讀 `AGENTS.md`、`GOAL.md`、`PRD/SPEC.md`。
2. 先完成 AC-001（品質閘門），其餘 AC 各開分支與 PR，標題含 AC 編號。
3. 先寫測試再實作；只用假資料。
4. 把指令與 exit code 記到 `STATUS.md`。

## 故意不做（M1）

- ❌ 金流、通知、SSO、多組織。
- ❌ 真實學員資料、production 部署變更。
