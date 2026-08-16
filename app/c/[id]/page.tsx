"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
};

type Course = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  questions: Question[];
};

export default function CoursePage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 載入課程
  useState(() => {
    fetch(`/api/courses/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.course) {
          setCourse(d.course);
          setAnswers(new Array(d.course.questions.length).fill(-1));
        } else {
          setError("Course not found");
        }
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  });

  if (loading) return <main className="container"><p>載入中...</p></main>;
  if (error) return <main className="container"><p>錯誤：{error} <Link href="/">回首頁</Link></p></main>;
  if (!course) return <main className="container"><p>找不到課程</p></main>;

  function setAnswer(qIdx: number, cIdx: number) {
    setAnswers((a) => a.map((v, i) => (i === qIdx ? cIdx : v)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("請填 Email");
      return;
    }
    if (answers.some((a) => a < 0)) {
      setError("請回答所有題目");
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch(`/api/courses/${course!.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), answers }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.error ?? "送出失敗");
        setSubmitting(false);
        return;
      }
      router.push(`/c/${course!.id}/result/${data.submission.id}`);
    } catch (e) {
      setError(`網路錯誤：${e instanceof Error ? e.message : String(e)}`);
      setSubmitting(false);
    }
  }

  const answeredCount = answers.filter((a) => a >= 0).length;

  return (
    <main className="container">
      <Link href="/" className="back">← 回課程列表</Link>
      <h1>{course.title}</h1>
      <p className="subtitle">{course.description}</p>

      <div className="video-wrap">
        <iframe
          src={course.youtubeUrl}
          title={course.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <form className="form" onSubmit={onSubmit}>
        <h2 className="section-title">作答</h2>
        <label className="field">
          <span>你的 Email *</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </label>

        {course.questions.map((q, qIdx) => (
          <fieldset key={q.id} className="question-block">
            <legend>
              <strong>第 {qIdx + 1} 題</strong>: {q.prompt}
            </legend>
            <div className="choices">
              {q.choices.map((c, cIdx) => (
                <label key={cIdx} className="choice-row">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[qIdx] === cIdx}
                    onChange={() => setAnswer(qIdx, cIdx)}
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <div className="submit-row">
          <button type="submit" className="btn-primary" disabled={submitting || answeredCount < course.questions.length}>
            {submitting ? "送出中..." : "送出作答"}
          </button>
          <span className="answered-count">{answeredCount} / {course.questions.length} 已答</span>
        </div>

        {error && <p className="msg-err">{error}</p>}
      </form>

      <nav className="nav">
        <a href={`/admin/c/${course.id}/stats`}>📊 看統計</a>
      </nav>
    </main>
  );
}
