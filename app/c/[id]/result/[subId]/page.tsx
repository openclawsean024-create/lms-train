import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getSubmission } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
}: {
  params: { id: string; subId: string };
}) {
  const submission = await getSubmission(params.subId);
  const course = await getCourse(params.id);
  if (!submission || !course || submission.courseId !== course.id) {
    notFound();
  }

  const correctCount = submission.perQuestion.filter((p) => p.correct).length;
  const total = course.questions.length;
  const percent = submission.score;

  return (
    <main className="container">
      <Link href="/" className="back">← 回首頁</Link>
      <h1>{course.title}</h1>
      <p className="subtitle">作答結果</p>

      <div className="result-summary">
        <div className="score-circle">
          <div className="score-num">{percent}</div>
          <div className="score-label">分</div>
        </div>
        <div className="score-detail">
          <p className="score-main">答對 <strong>{correctCount}</strong> / {total} 題</p>
          <p className="score-email">Email: {submission.email}</p>
          <p className="score-time">{new Date(submission.at).toLocaleString("zh-TW")}</p>
        </div>
      </div>

      <section className="section">
        <h2 className="section-title">每題對錯</h2>
        <ol className="result-list">
          {course.questions.map((q, i) => {
            const pq = submission.perQuestion[i];
            const userAnswer = submission.answers[i];
            const correctAnswer = q.answerIndex;
            return (
              <li key={q.id} className={`result-item ${pq.correct ? "correct" : "wrong"}`}>
                <div className="result-status">
                  {pq.correct ? "✓ 答對" : "✗ 答錯"}
                </div>
                <p className="result-q"><strong>第 {i + 1} 題</strong>: {q.prompt}</p>
                <p className="result-answer">
                  你的答案：<span className={pq.correct ? "ans-correct" : "ans-wrong"}>
                    {q.choices[userAnswer]}
                  </span>
                </p>
                {!pq.correct && (
                  <p className="result-answer">
                    正確答案：<span className="ans-correct">{q.choices[correctAnswer]}</span>
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <nav className="nav">
        <a href={`/c/${course.id}`}>↻ 重看課程</a>
        <a href={`/admin/c/${course.id}/stats`}>📊 看課程統計</a>
      </nav>
    </main>
  );
}
