export default function Home() {
  return (
    <main className="container">
      <h1>LMS Train</h1>
      <p className="subtitle">線上教育訓練系統 — 影片 + 考題 + 統計</p>
      <p className="demo-note">⚠️ Demo 模式：新建立的資料會在下次部署後重置。</p>
      <nav className="nav">
        <a href="/admin">建立課程（老師）</a>
      </nav>
      <p className="hint">M1 骨架完成 — 接下來 M2 會顯示課程列表。</p>
    </main>
  );
}
