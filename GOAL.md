# Goal — 輕量教育訓練平台 M1

## Objective

在只用假資料、不接真實金流與通知的前提下，把現有 demo 變成「可交付給一個試用單位」的底稿：品質閘門真正擋得住失敗、作答前不外洩答案、資料可持久化、管理端有保護、管理者能看逐人成績並匯出 CSV、學員看得到個資告知。

規格依據：`PRD/SPEC.md` v4.0（§4 FR、§8 M1）。

## Acceptance criteria

每條 AC 的「驗證」指令必須 exit 0；測試檔名可在實作 PR 調整，但須同步更新本檔與 `SOP.md`。

- **AC-001：品質閘門擋得住失敗**
  - `package.json` 新增 `typecheck`（`tsc --noEmit`）、`test`（Vitest）與 `e2e`（Playwright）script；`lint` 改為有設定檔的 ESLint 9（flat config），不再依賴互動式 `next lint`。
  - 只保留一種 lockfile（npm）；刪除 `pnpm-lock.yaml`。
  - CI 移除所有 `continue-on-error` 與 `|| echo`；新增 typecheck、e2e job；移除或改正 GitHub Pages deploy（Next 不產生 `dist/`）。
  - 驗證：`npm run lint && npm run typecheck && npm test && npm run build && npm run e2e` 全部 exit 0；`grep -nE "continue-on-error|\|\| echo" .github/workflows/ci.yml` 無結果；PR 上 GitHub Actions 全綠。

- **AC-002：作答前不外洩答案**（FR-003）
  - 學員用的課程 API（`GET /api/courses/[id]`、`GET /api/courses`）回傳的題目不含 `answerIndex`；只有管理端 API 與作答後結果頁可取得正解。
  - 驗證：`npm test -- tests/course-public.test.ts`（斷言公開 API 回應 JSON 不含 `answerIndex` 鍵）；`npm run e2e -- tests/e2e/learner-flow.spec.ts`（攔截網路回應斷言無 `answerIndex`）。

- **AC-003：資料持久化 adapter**（FR-006）
  - `lib/db.ts` 改為 `Repository` 介面，提供 `memory`（測試用）與一個可持久化實作（選型依 SPEC §12 第 2 點）；由環境變數切換，未設定時 dev 用本機檔案、CI 用 memory。
  - 不在 repo 放任何資料庫連線字串。
  - 驗證：`npm test -- tests/repository.test.ts`（同一組合約測試跑 memory 與檔案實作：建課、作答、統計、重開 repository 後資料仍在）；`git grep -nE "postgres(ql)?://|DATABASE_URL=" -- ':!*.md'` 無結果。

- **AC-004：管理端保護**（FR-007）
  - `/admin`、`/admin/c/[id]/stats`、`POST /api/courses`、統計與成績 API 需管理者驗證（M1 用環境變數 `ADMIN_PASSWORD` + httpOnly session cookie，cookie 值不得是可猜的明文）；未驗證回 401 或導向登入頁。
  - 驗證：`npm test -- tests/admin-auth.test.ts`（未登入 401、密碼錯 401、登入後 201）；`npm run e2e -- tests/e2e/admin-guard.spec.ts`。

- **AC-005：逐人成績與 CSV 匯出**（FR-008）
  - 統計頁新增逐人表（Email、分數、作答時間）與「匯出 CSV」；CSV 第一列標註「含個資」與匯出時間；Email 欄位在畫面上預設部分遮罩。
  - 驗證：`npm test -- tests/export-csv.test.ts`（欄位、跳脫逗號與引號、UTF-8 BOM）；`npm run e2e -- tests/e2e/stats-export.spec.ts`。

- **AC-006：個資告知與刪除**（FR-009）
  - 作答頁在 Email 欄位旁顯示蒐集目的與保存說明；未勾選「我已閱讀」不能送出。
  - 管理者可刪除單一學員的所有作答紀錄。
  - 所有 seed、測試、fixture 的 Email 一律 `@example.com`。
  - 驗證：`npm test -- tests/submission-delete.test.ts tests/fixtures-safety.test.ts`（後者掃描 `data/` 與 `tests/`，出現非 `example.com` Email 即失敗）；`npm run e2e -- tests/e2e/learner-flow.spec.ts`。

## Out of scope

- 真實金流、訂閱計費、發票。
- Email／LINE 通知與提醒（含指派通知）。
- 真實員工或客戶資料；production 部署與 Vercel 設定變更。
- 多組織 SaaS、SSO、影片上傳與私有影片託管、觀看完成度追蹤。
- 課程編輯、及格重考、指派名單（M2）。

## Exit gate

- AC-001～AC-006 的驗證指令全部 exit 0，並記錄於 `STATUS.md`。
- 實作 PR 的 GitHub Actions（lint、typecheck、test、build、e2e）全綠。
- Sean 確認 `PRD/SPEC.md` §12 待決事項（尤其是試用單位與持久化選型）後，才可進入 M2。
