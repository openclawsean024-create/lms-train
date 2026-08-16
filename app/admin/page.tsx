"use client";

import { useState } from "react";

type Question = { prompt: string; choices: string[]; answerIndex: number };

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { prompt: "", choices: ["", "", "", ""], answerIndex: 0 },
    { prompt: "", choices: ["", "", "", ""], answerIndex: 0 },
    { prompt: "", choices: ["", "", "", ""], answerIndex: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function updateQuestion(i: number, patch: Partial<Question>) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }

  function updateChoice(i: number, c: number, value: string) {
    setQuestions((qs) =>
      qs.map((q, idx) =>
        idx === i ? { ...q, choices: q.choices.map((vv, cc) => (cc === c ? value : vv)) } : q
      )
    );
  }

  function addQuestion() {
    if (questions.length >= 10) return;
    setQuestions((qs) => [
      ...qs,
      { prompt: "", choices: ["", "", "", ""], answerIndex: 0 },
    ]);
  }

  function removeQuestion(i: number) {
    if (questions.length <= 3) return;
    setQuestions((qs) => qs.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const r = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, youtubeUrl, questions }),
      });
      const data = await r.json();
      if (!r.ok) {
        setMessage({ type: "err", text: data.error ?? "送出失敗" });
        return;
      }
      setMessage({ type: "ok", text: `✅ 已建立課程：${data.course.title}（id: ${data.course.id}）` });
      // 清空
      setTitle("");
      setDescription("");
      setYoutubeUrl("");
      setQuestions([
        { prompt: "", choices: ["", "", "", ""], answerIndex: 0 },
        { prompt: "", choices: ["", "", "", ""], answerIndex: 0 },
        { prompt: "", choices: ["", "", "", ""], answerIndex: 0 },
      ]);
    } catch (e: unknown) {
      setMessage({ type: "err", text: `網路錯誤：${e instanceof Error ? e.message : String(e)}` });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <a href="/" className="back">← 回首頁</a>
      <h1>建立課程（老師）</h1>
      <p className="subtitle">Demo 模式：任何人可建,資料存於 Vercel /tmp,下次部署會重置。</p>

      <form className="form" onSubmit={onSubmit}>
        <label className="field">
          <span>課程標題 *</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="例如：React 進階"
          />
        </label>

        <label className="field">
          <span>課程描述</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="簡短說明這個課程在做什麼"
          />
        </label>

        <label className="field">
          <span>YouTube 嵌入 URL *</span>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            required
            placeholder="https://www.youtube.com/embed/VIDEO_ID"
          />
          <small className="hint-text">把 YouTube 影片設為「非公開」後,從分享 → 嵌入複製 iframe 的 src URL</small>
        </label>

        <fieldset className="questions-fs">
          <legend>考題（至少 3 題,最多 10 題）</legend>
          {questions.map((q, i) => (
            <div key={i} className="question-block">
              <div className="question-header">
                <strong>第 {i + 1} 題</strong>
                {questions.length > 3 && (
                  <button type="button" className="btn-link" onClick={() => removeQuestion(i)}>
                    刪除
                  </button>
                )}
              </div>
              <label className="field">
                <span>題目</span>
                <input
                  type="text"
                  value={q.prompt}
                  onChange={(e) => updateQuestion(i, { prompt: e.target.value })}
                  required
                />
              </label>
              <div className="choices">
                {q.choices.map((c, cIdx) => (
                  <label key={cIdx} className="choice-row">
                    <input
                      type="radio"
                      name={`answer-${i}`}
                      checked={q.answerIndex === cIdx}
                      onChange={() => updateQuestion(i, { answerIndex: cIdx })}
                    />
                    <input
                      type="text"
                      value={c}
                      onChange={(e) => updateChoice(i, cIdx, e.target.value)}
                      placeholder={`選項 ${cIdx + 1}`}
                      required
                    />
                  </label>
                ))}
              </div>
              <small className="hint-text">點選 ○ 標示正確答案</small>
            </div>
          ))}
          {questions.length < 10 && (
            <button type="button" className="btn-secondary" onClick={addQuestion}>
              + 加一題
            </button>
          )}
        </fieldset>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "送出中..." : "建立課程"}
        </button>

        {message && (
          <p className={message.type === "ok" ? "msg-ok" : "msg-err"}>{message.text}</p>
        )}
      </form>
    </main>
  );
}
