# LMS Train — 線上教育訓練系統

## 目標

最小可行的 LMS（MVP）：老師建課（影片 + 考題）→ 學員看課答題 → 系統統計成績。

**非會員可用**。部署到 Vercel 公開 URL。

## 角色

| 角色 | 入口 | 動作 |
|---|---|---|
| **老師** | `/admin` | 建課（標題 + YouTube unlisted URL + 至少 3 題選擇題） |
| **學員** | `/c/[id]` | 留 Email → 看影片 → 答題 → 看分數 |
| **任何人** | `/` | 看課程列表 |

## 資料模型

```ts
type Course = {
  id: string;          // slug, e.g. "intro-nextjs"
  title: string;
  description: string;
  youtubeUrl: string;  // unlisted YouTube embed URL
  createdAt: number;
  questions: Question[];
};

type Question = {
  id: string;
  prompt: string;
  choices: string[];   // 4 choices
  answerIndex: number; // 0..3
};

type Submission = {
  id: string;
  courseId: string;
  email: string;
  answers: number[];   // user-chosen indices
  score: number;       // 0..100
  perQuestion: { qid: string; correct: boolean }[];
  at: number;
};
```

## 頁面

| 路徑 | 用途 |
|---|---|
| `/` | 課程列表（標題 + 描述 + 開始學習） |
| `/c/[id]` | 學員看課（YouTube iframe + Email 輸入 + 答題表單） |
| `/c/[id]/result/[subId]` | 顯示分數 + 每題對錯 |
| `/admin` | 老師建課表單（標題 + URL + 題目） |
| `/admin/c/[id]/stats` | 統計（總作答數 / 平均分 / 各題答對率） |

## API 路由

| Method | Path | 用途 |
|---|---|---|
| GET | `/api/courses` | 列出所有課程 |
| POST | `/api/courses` | 建立新課程 |
| GET | `/api/courses/[id]` | 取得單一課程 |
| POST | `/api/courses/[id]/submit` | 學員收卷 |
| GET | `/api/submissions/[id]` | 取得單次作答 |
| GET | `/api/courses/[id]/stats` | 統計 |

## 儲存

**Demo 模式**（Vercel serverless 限制）：

- 靜態種子資料隨 repo commit（`data/seed.json`，含 1 個範例課程）
- API 寫入 Vercel runtime `/tmp/data.json`（同 instance 持久）
- Cold start 或新部署會重置使用者新增的資料，**首頁明示**
- 7 天後考慮遷移至 Vercel KV / Neon Postgres

## 驗收標準（MUST-HAVE）

1. 公開 Vercel URL → HTTP 200
2. 完整流程可走通：
   - 老師到 `/admin` 建課（標題 + YouTube unlisted URL + 至少 3 題選擇題）
   - 學員到 `/c/[id]` 留 Email → 看影片 → 答題
   - 學員到 `/c/[id]/result/[subId]` 看分數 + 每題對錯
   - 任何人到 `/admin/c/[id]/stats` 看統計（總作答數、平均分、各題答對率）
3. 所有結果有 curl + 瀏覽器實測證據

## 禁用

- ❌ 會員制 / 登入 / OAuth
- ❌ LLM 評分 / AI 評 essay
- ❌ 影片上傳（用 YouTube embed）
- ❌ 金流 / 訂閱
- ❌ residence 認證

## 技術棧

- Next.js 14（App Router）+ TypeScript
- React 18
- 純 CSS modules（不引外部 UI lib）
- Vercel 部署

## 里程碑

| # | 名稱 | 驗收 |
|---|---|---|
| M1 | Skeleton + SPEC | Repo 創好, `npm run dev` 200 OK |
| M2 | 課程列表 + 影片播放頁 | `curl /` 200 含 1 個課程; `curl /c/[id]` 200 含 YouTube iframe |
| M3 | 考題 CRUD + 老師建課表單 | `POST /api/courses` 201; 表單可用 |
| M4 | 學員作答 + 結果頁 | `POST /api/courses/[id]/submit` 回 `{score, perQuestion}` |
| M5 | 統計 API + 儀表板 | `GET /api/courses/[id]/stats` 回 `{total, avg, perQuestion}` |
| M6 | Vercel 部署 + 煙霧測試 | 公開 URL 200 + 走完整流程 |
| M7 | 最終報告 + 截圖 | audit table + 4 張截圖 |
