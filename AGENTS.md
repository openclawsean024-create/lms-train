# AGENTS.md — 輕量教育訓練平台（lms-train）

## 1. 權威文件與範圍

- 規格：[`PRD/SPEC.md`](./PRD/SPEC.md) v4.0（§0 評估、FR 狀態、里程碑）。
- 目前目標：[`GOAL.md`](./GOAL.md)（只含 M1）。
- 驗證指令：[`SOP.md`](./SOP.md)；目前狀態：[`STATUS.md`](./STATUS.md)。
- 定位：給中小企業／門市的輕量內訓工具，先以專案建置交付；不做大型 LMS。

## 2. 專案結構

```
app/
├── page.tsx                     # 課程列表（server component）
├── admin/page.tsx               # 建課表單（client）
├── admin/c/[id]/stats/page.tsx  # 統計
├── c/[id]/page.tsx              # 學員看影片 + 答題（client）
├── c/[id]/result/[subId]/       # 結果頁
└── api/                         # courses、courses/[id]、submit、stats、submissions/[id]
lib/db.ts                        # 資料層（目前寫 /tmp JSON）
lib/types.ts                     # Course、Question、Submission、Stats
data/seed.json                   # 範例課程
M6-EVIDENCE.md、dashboard.html   # 舊部署紀錄與 fleet 狀態頁，不參與 build
```

## 3. 技術棧

Next.js 14.2.18（App Router）、React 18.3、TypeScript 5.5（strict）、全域 CSS。無測試框架、無 ESLint 設定、無資料庫。CI：`.github/workflows/ci.yml`（現況見 SOP）。

## 4. 開發規則

1. **只用假資料**：Email 一律 `@example.com`；不得放入真實員工、學員或客戶資料。發現疑似真實個資，不複製、回報路徑。
2. **不得提交憑證**：資料庫連線字串、`ADMIN_PASSWORD`、Vercel token 只放環境變數或部署平台。
3. **測試不可為了通過而刪改斷言**：不得 `.skip`／`.only`、放寬斷言或改期望值；行為變更需在 PR 說明並對應 FR／AC。
4. **答案保護**：任何給學員的 API 或頁面在作答前不得帶出 `answerIndex`。
5. **不擴大 scope**：通知、金流、SSO、多組織不在 M1；新增需求先改 SPEC 並經 Sean 同意。
6. **Git**：從 `main` 開分支、以 PR 合併；不直接 push `main`、不 force push、不改 repo 設定、不在未經 Sean 同意下部署 production。
7. **Commit 格式**：`<type>(scope): <說明或 AC 編號>`，例如 `fix(api): AC-002 strip answerIndex`。

## 5. 驗證

見 [`SOP.md`](./SOP.md)。標「尚未配置」的指令不得宣稱已通過。
