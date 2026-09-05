# 拾光設計系統 — LMS Train (M7 重製)

> 本檔由 orchestrator (Mavis) 在 M7 啟動前預先寫入,作為整個 M7 重製的單一合約。
> 所有 page-redesign worker 必須遵守本系統,所有 verifier 必須以此為標竿。

## 1. 品牌定位

**拾光設計 / Tenet Studio** — 跨 30 業種的高人氣 + 嚴格零線上存在 + 排隊名店。
**LMS Train** 是拾光框架下的「線上教育訓練系統」業種樣板。

LMS Train 本身屬於 demo 模式 (Vercel `/tmp` 持久化),所有頁面要視為**設計提案浮水印版** —
也就是即使只是 demo,也要長得像可以拿去 pitch 給店家的提案稿。

### 視覺關鍵字
- **印刷感** — 像 1970s 老字號印刷品
- **米其林 bib 風格** — 留白多,排版嚴謹,資訊密度低
- **黑 + 燙金 + 紅印章 + 米白** — 四色限定
- **章節編號** — 中文書卷感,`<h2>` 前面加「第 X 課」「章 X」之類的中式編號
- **角落印章** — 浮水印式:CONCEPT · 設計提案 · DEMO NOT FOR PRODUCTION

### 禁用
- ❌ 漸層陰影 (drop shadow gradient)
- ❌ 圓角膠囊按鈕 (border-radius > 4px)
- ❌ emoji 圖示
- ❌ 彩色標籤 (除紅印章 `--stamp`)
- ❌ 任何 SaaS 風 (Inter / Tailwind 預設藍 / 8px 圓角 / 0.5 透明度陰影)

## 2. 色彩 Token (CSS 變數)

定義在 `app/globals.css` 的 `:root`:

```css
:root {
  /* 主色 */
  --ink:        #0E0E0E;  /* 主文字 */
  --ink-soft:   #2A2722;  /* 次要文字、分隔線 */
  --paper:      #F5EFE2;  /* 主背景米白 */
  --paper-2:    #EFE7D6;  /* 次背景 (章節區塊) */
  --paper-3:    #E8DFC8;  /* 第三層背景 (卡片內) */

  /* 燙金 */
  --gold:       #B08947;  /* 主燙金 */
  --gold-soft:  #D4AF6A;  /* 副燙金 / hover */
  --gold-bg:    #F2E5C7;  /* 金色標籤底 */

  /* 紅印章 */
  --stamp:      #B22D2D;  /* 紅印章主色 */
  --stamp-soft: #C44B4B;  /* 紅印章 hover */

  /* 規則線 */
  --rule:       #2A2722;  /* 主分隔線 */
  --rule-soft:  #C7BFAE;  /* 次分隔線 */
  --rule-faint: #D9D2BE;  /* 極淡分隔線 */

  /* 狀態色 (僅用在答對/答錯、統計好壞,主畫面不靠狀態色) */
  --ok:         #1F5D3A;  /* 答對 (墨綠,非亮綠) */
  --err:        var(--stamp);
}
```

### 對比 / 可用性
- `--ink` on `--paper` = 對比 16:1 (AAA)
- `--gold` on `--paper` = 對比 4.6:1 (AA Large + AA Normal)
- 紅印章只用在印章形狀 + 標籤,不當按鈕

## 3. 字型 Stack

從 Google Fonts 載入 (用 `next/font/google`,不要在 `<link>` 寫):

```ts
// app/layout.tsx
import { DM_Serif_Display, Noto_Serif_TC, ZCOOL_XiaoWei, Long_Cang, Special_Elite, JetBrains_Mono } from "next/font/google";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const notoSerifTC = Noto_Serif_TC({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-tc" });
const xiaoWei = ZCOOL_XiaoWei({ subsets: ["latin"], weight: "400", variable: "--font-handwrite" });
const longCang = Long_Cang({ subsets: ["latin"], weight: "400", variable: "--font-stamp" });
const specialElite = Special_Elite({ subsets: ["latin"], weight: "400", variable: "--font-mono-stamp" });
const jetMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });
```

| 用途 | CSS 變數 | 對應 Google Font |
|---|---|---|
| 大標 (章節名) | `--font-display` | DM Serif Display |
| 中文標題 | `--font-tc` | Noto Serif TC |
| 中文內文 | `--font-tc` | Noto Serif TC |
| 手寫感 (副標、章節副名) | `--font-handwrite` | ZCOOL XiaoWei |
| 印章字 | `--font-stamp` | Long Cang |
| 印刷英文小標 | `--font-mono-stamp` | Special Elite |
| 等寬 (Email、時間戳) | `--font-mono` | JetBrains Mono |

### 字級階梯
```
--fs-display:   72px;   /* 章節大標 (首頁 hero) */
--fs-h1:        48px;   /* 頁面主標 */
--fs-h2:        32px;   /* 章節標 */
--fs-h3:        22px;   /* 子章節 */
--fs-body:      17px;   /* 內文 */
--fs-small:     14px;   /* 註腳 */
--fs-stamp:     12px;   /* 印章字 (letter-spacing 0.2em) */
```

### 行高 / 字距
- 內文: line-height 1.7, letter-spacing 0.02em
- 標題: line-height 1.2, letter-spacing 0
- 印章: line-height 1, letter-spacing 0.2em, text-transform uppercase

## 4. 排版骨架

### 頁面結構
```
┌──────────────────────────────────────────┐
│ [ 浮水印 CONCEPT 印章 (右上角) ]            │
│                                          │
│  ╔══ 章節編號 ══╗                        │
│  ║  第 X 課    ║                        │
│  ╚═════════════╝                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │ (主分隔線 --rule)
│  H1 章節大標                              │
│  ─────────── 燙金細線 ───────────          │
│  副標 / 描述                              │
│                                          │
│  ┌─────────────┬─────────────┐           │
│  │  卡片 A     │  卡片 B     │           │
│  └─────────────┴─────────────┘           │
│                                          │
│  [頁尾: 頁碼 + 設計提案浮水印]              │
└──────────────────────────────────────────┘
```

### 容器
- `.tenet-container`: max-width 980px, margin auto, padding 64px 32px
- `.tenet-container--narrow`: max-width 720px (作答頁、登入頁)
- `.tenet-container--wide`: max-width 1200px (統計儀表板)

### 章節標
每頁頂部:
```html
<div className="tenet-chapter">
  <span className="tenet-chapter-num">第 〇 課</span>
  <span className="tenet-chapter-title">課程列表</span>
</div>
```

CSS:
```css
.tenet-chapter {
  display: flex;
  align-items: baseline;
  gap: 16px;
  border-bottom: 2px solid var(--rule);
  padding-bottom: 12px;
  margin-bottom: 32px;
}
.tenet-chapter-num {
  font-family: var(--font-mono-stamp);
  font-size: var(--fs-stamp);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--stamp);
}
.tenet-chapter-title {
  font-family: var(--font-tc);
  font-size: var(--fs-h2);
  font-weight: 500;
  color: var(--ink);
}
```

### 浮水印印章 (右上角)
固定在每頁右上,固定位置:
```html
<div className="tenet-stamp" aria-hidden="true">CONCEPT · 設計提案</div>
```
CSS:
```css
.tenet-stamp {
  position: fixed;
  top: 24px;
  right: 24px;
  font-family: var(--font-stamp);
  font-size: 18px;
  color: var(--stamp);
  border: 2px solid var(--stamp);
  padding: 6px 12px;
  transform: rotate(8deg);
  opacity: 0.85;
  pointer-events: none;
  z-index: 100;
}
```

頁尾印章 (頁碼感):
```html
<footer className="tenet-footer">
  <span>— LMS Train · 拾光設計提案 · M7 —</span>
</footer>
```

## 5. 通用元件

### 按鈕 (.tenet-btn)
```css
.tenet-btn {
  font-family: var(--font-tc);
  font-size: var(--fs-body);
  font-weight: 500;
  padding: 14px 28px;
  border: 1px solid var(--ink);
  background: var(--ink);
  color: var(--paper);
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: all 0.15s;
}
.tenet-btn:hover:not(:disabled) {
  background: var(--paper);
  color: var(--ink);
  border-color: var(--gold);
  box-shadow: 0 0 0 1px var(--gold);  /* 燙金外框 (非陰影) */
}
.tenet-btn--gold {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--paper);
}
.tenet-btn--gold:hover { background: var(--gold-soft); }
.tenet-btn--ghost {
  background: transparent;
  color: var(--ink);
  border-color: var(--rule);
}
.tenet-btn--ghost:hover { border-color: var(--ink); }
.tenet-btn:disabled { opacity: 0.4; cursor: not-allowed; }
```

### 輸入框 (.tenet-input)
```css
.tenet-input, .tenet-textarea {
  font-family: var(--font-tc);
  font-size: var(--fs-body);
  padding: 10px 0;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--rule-soft);
  color: var(--ink);
  width: 100%;
}
.tenet-input:focus, .tenet-textarea:focus {
  outline: none;
  border-bottom-color: var(--gold);
  border-bottom-width: 2px;
}
.tenet-label {
  font-family: var(--font-mono-stamp);
  font-size: var(--fs-stamp);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--ink-soft);
  display: block;
  margin-bottom: 4px;
}
```

### 卡片 (.tenet-card)
```css
.tenet-card {
  background: var(--paper);
  border: 1px solid var(--rule-soft);
  padding: 24px;
  position: relative;
  transition: border-color 0.2s, transform 0.2s;
}
.tenet-card:hover {
  border-color: var(--gold);
  transform: translateY(-2px);
}
.tenet-card::before {
  content: "";
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 1px solid var(--rule-faint);
  pointer-events: none;
}
```

### 章節編號角章 (.tenet-corner)
頁面左上角,中式書卷感:
```html
<div className="tenet-corner">第 X 章</div>
```

### 列表 (章節式)
每個 list item 前面加「第 N 則」中式編號:
```html
<ol className="tenet-list">
  <li>...</li>
</ol>
```

## 6. 各頁面細節

### 6.1 `/` (課程列表)
- Hero: 大字「線上教育訓練」+ 「線上教育訓練系統 — 影片 · 考題 · 統計」副標
- 課程卡片網格 (1-3 欄,自適應)
- 卡片內容: 章節編號 (e.g. 「第 壹 課」) + 課程標題 + 描述 + 「N 題」+ 「開始學習 →」連結
- Demo 提醒條: 米白底 + 紅印章邊框 + 印章字
- 底部: 「→ 建立新課程 (老師)」連結 (置中,燙金底黑字按鈕)

### 6.2 `/c/[id]` (學員看課)
- 章節標: 「第 〇 課」+ 課程標題
- YouTube iframe: 16:9,黑色外框 + 1px 金色內框
- Email 輸入: 底線式,標籤用「聯絡 EMAIL」
- 答題區: 每題一個 card,題號「第 N 題」中式編號,4 個選項為 radio (大圓圈 + 文字)
- 提交按鈕: 燙金底黑字 (`.tenet-btn--gold`)
- 答題計數: 印章字,「已答 N / M」

### 6.3 `/c/[id]/result/[subId]` (結果)
- 大分數: 100px DM Serif Display,墨黑
- 「分」字小一號
- 答對/答錯列表: 每題一張卡,左邊 4px 邊條 (綠/紅),題目 + 你的答案 + 正確答案
- 答對: 「✓ 答對」墨綠
- 答錯: 「✗ 答錯」紅印章 + 「正解: ○○」墨綠

### 6.4 `/admin` (老師建課)
- 章節標: 「第 〇 章」+ 「建立課程」
- 表單: 底線式輸入
- 題目編輯: 每題一個 card (`.tenet-card`),題號「第 N 題」+ 4 個選項 + 正確答案 radio
- 「新增題目」按鈕: ghost 風格
- 「建立課程」按鈕: 主黑色
- 表單錯誤: 紅印章色,印章字

### 6.5 `/admin/c/[id]/stats` (統計儀表板)
- 章節標: 「第 〇 章」+ 「統計 · 課程名」
- 三張 KPI 卡: 總作答數 / 平均分 / 題目數 (用 `.tenet-card` 變體,大數字 + 小標籤)
- 各題答對率: 進度條 (用 `--ok` 墨綠填色,黑色底)
- 答對率標籤: 「N%」印章字 + 顏色 (>=80 墨綠, 50-79 燙金, <50 紅印章)

## 7. CSS 架構規範

### 命名
- 全域 class: `.tenet-*` 前綴 (避免與現有 class 衝突,設計系統層)
- 共用元件: `.tenet-btn`, `.tenet-card`, `.tenet-input` 等放在 `app/globals.css`
- 頁面專屬樣式: 該頁同目錄 `page.module.css` (CSS Modules)

### 切換策略
- `app/globals.css` 只放: CSS 變數、字型設定、`.tenet-*` 共用元件
- 每頁改成 co-located CSS Module,例如:
  ```
  app/page.tsx
  app/page.module.css      ← 新增
  app/c/[id]/page.tsx
  app/c/[id]/page.module.css  ← 新增
  ```
- 移除 `app/globals.css` 中所有頁面專屬的舊 class (`.course-list`, `.video-wrap`, `.stat-card` 等)

### CSS 解析安全性 (重要!)
inline `<style>` 太大 (>25KB) 容易炸。`globals.css` 寫完控制在 **< 12KB**。
若需要 base64 SVG data URL,一律用 `data:image/svg+xml;base64,...`。
`content:"..."` 字串如需含 CJK,用 CSS hex escape (`\98DF \5242` 為「食刻」)。

## 8. 驗收標準 (M7)

設計系統層的驗收:
- [ ] 全部字型透過 `next/font/google` 載入,無 `<link>` 寫法
- [ ] `:root` 內含所有 token,實際樣式都引用 `var(--*)`
- [ ] `.tenet-*` 通用元件齊全 (button / input / card / chapter / stamp / footer)
- [ ] `npm run typecheck` 0 錯
- [ ] `npm run build` 全綠
- [ ] 首頁在 dev server 看到完整拾光視覺 (黑米白燙金印章四色限定)
- [ ] `globals.css` size < 12KB
