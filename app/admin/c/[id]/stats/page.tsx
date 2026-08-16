import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getCourseStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function StatsPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  if (!course) notFound();
  const stats = await getCourseStats(params.id);
  if (!stats) notFound();

  return (
    <main className="container">
      <Link href="/" className="back">← 回首頁</Link>
      <h1>{course.title}</h1>
      <p className="subtitle">統計儀表板</p>

      <section className="stats-summary">
        <div className="stat-card">
          <div className="stat-label">總作答數</div>
          <div className="stat-num">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">平均分數</div>
          <div className="stat-num">{stats.avg}<span className="stat-unit"> 分</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">題目數</div>
          <div className="stat-num">{course.questions.length}</div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">各題答對率</h2>
        {stats.total === 0 ? (
          <p className="empty">目前還沒有作答紀錄。</p>
        ) : (
          <ol className="question-stats">
            {stats.perQuestion.map((pq, i) => {
              const q = course.questions[i];
              return (
                <li key={pq.qid} className="question-stat">
                  <div className="qs-header">
                    <span className="qs-label">第 {i + 1} 題</span>
                    <span className={`qs-rate ${pq.correctRate >= 70 ? "good" : pq.correctRate >= 40 ? "mid" : "bad"}`}>
                      {pq.correctRate}%
                    </span>
                  </div>
                  <p className="qs-prompt">{q.prompt}</p>
                  <div className="qs-bar">
                    <div className="qs-bar-fill" style={{ width: `${pq.correctRate}%` }} />
                  </div>
                  <p className="qs-meta">{pq.totalAnswers} 人作答 · 答對 {Math.round(pq.totalAnswers * pq.correctRate / 100)} 人</p>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <nav className="nav">
        <a href={`/c/${course.id}`}>↗ 看學員頁</a>
        <a href="/admin">📝 再建一門課</a>
      </nav>
    </main>
  );
}
