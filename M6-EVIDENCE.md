# M6 — Vercel Deployment Evidence

## Production URL
- Canonical: **https://lms-train-iota.vercel.app**
- Auto-gen: lms-train-m2y158eyf-seans-projects-7dc76219.vercel.app
- (Vercel project 自動歸在 `seans-projects-7dc76219` team)

## Deployment
- **Project ID**: `prj_4ri1a5hAiXGWyt2HADQiOF7dBLJ1`
- **Deployment ID**: `dpl_J9FqZWzVmFF8PhbuY4a6Fap9f5T1`
- **Deployed SHA**: `fec7fde504f3e1ea86dadb50b88f0822f5d5ee5d` (M5 commit)
- **Local HEAD = Origin HEAD = Vercel SHA** ✓
- **Build time**: 37 秒
- **Plan**: Hobby (12 serverless functions cap, 我們用 7 個)

## SSO 清掉
- New projects default SSO = `{"deploymentType": "all_except_custom_domains"}`
- PATCH 設為 `null` → `ssoProtection: None` ✓

## Smoke Test (production)
| # | Endpoint | 結果 |
|---|---|---|
| 1 | GET / | 200, 6057 bytes, 含 seed 課程 |
| 2 | GET /c/intro-nextjs | 200, 5309 bytes |
| 3 | GET /api/courses | 1 個 seed 課程 |
| 4 | POST /api/courses | 201, 新建 "Vercel 部署測試" vercel-部署測試-96fe |
| 5 | POST /api/courses/intro-nextjs/submit | 201, score=100 |
| 6 | GET /api/courses/intro-nextjs/stats | total=1, avg=100, q1-3 都 100% |
| 7 | GET /admin/c/intro-nextjs/stats | 200, 8491 bytes |
| 8 | GET /api/courses/nonexistent/stats | 404 |

## Demo 模式 Demo 限制(已知)
- `/tmp` 資料在 Vercel serverless cold start 會被清
- Seed 課程每次 cold start 都會還原
- 使用者 POST 的 submissions 在下次 cold start 重置後會 404
- 這是 SPEC §「儲存」明示的 demo 限制
- 修法: 遷移至 Vercel Postgres / Neon (M7 之後)

## 4 個 URL 對齊
- Local HEAD: `fec7fde5` ✓
- GitHub origin HEAD: `fec7fde5` ✓
- Vercel deployment SHA: `fec7fde5` ✓
- Production alias: `lms-train-iota.vercel.app` ✓
