import { NextRequest, NextResponse } from "next/server";
import { addSubmission, getCourse, randomId } from "@/lib/db";
import { Submission } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  let body: { email?: string; answers?: number[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const email = (body.email ?? "").trim();
  const answers = body.answers ?? [];

  if (!email) return NextResponse.json({ error: "email 必填" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "email 格式不正確" }, { status: 400 });
  }
  if (answers.length !== course.questions.length) {
    return NextResponse.json(
      { error: `作答數量錯誤: 預期 ${course.questions.length} 題,收到 ${answers.length}` },
      { status: 400 }
    );
  }
  for (let i = 0; i < answers.length; i++) {
    const a = answers[i];
    if (!Number.isInteger(a) || a < 0 || a >= course.questions[i].choices.length) {
      return NextResponse.json({ error: `第 ${i + 1} 題的答案無效` }, { status: 400 });
    }
  }

  // 算分
  let correctCount = 0;
  const perQuestion: { qid: string; correct: boolean }[] = course.questions.map((q, i) => {
    const ok = answers[i] === q.answerIndex;
    if (ok) correctCount += 1;
    return { qid: q.id, correct: ok };
  });
  const score = Math.round((correctCount / course.questions.length) * 100);

  const submission: Submission = {
    id: randomId("sub"),
    courseId: course.id,
    email,
    answers,
    score,
    perQuestion,
    at: Date.now(),
  };
  await addSubmission(submission);
  return NextResponse.json({ submission }, { status: 201 });
}
