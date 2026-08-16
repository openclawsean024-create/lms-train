import Link from "next/link";
import { listCourses } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const courses = await listCourses();

  return (
    <main className="container">
      <h1>LMS Train</h1>
      <p className="subtitle">線上教育訓練系統 — 影片 + 考題 + 統計</p>
      <p className="demo-note">
        ⚠️ Demo 模式：新建立的資料會在下次部署後重置。
      </p>

      <section className="section">
        <h2 className="section-title">課程列表 ({courses.length})</h2>
        {courses.length === 0 ? (
          <p className="empty">目前沒有課程。</p>
        ) : (
          <ul className="course-list">
            {courses.map((c) => (
              <li key={c.id} className="course-card">
                <h3 className="course-title">
                  <Link href={`/c/${c.id}`}>{c.title}</Link>
                </h3>
                <p className="course-desc">{c.description}</p>
                <p className="course-meta">{c.questions.length} 題</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <nav className="nav">
        <a href="/admin">建立課程（老師）</a>
      </nav>
    </main>
  );
}
