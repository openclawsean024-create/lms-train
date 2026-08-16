import { NextRequest, NextResponse } from "next/server";
import { addCourse, listCourses } from "@/lib/db";
import { Course, Question } from "@/lib/types";

export async function GET() {
  const courses = await listCourses();
  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  let body: {
    title?: string;
    description?: string;
    youtubeUrl?: string;
    questions?: { prompt: string; choices: string[]; answerIndex: number }[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim();
  const youtubeUrl = (body.youtubeUrl ?? "").trim();
  const rawQs = body.questions ?? [];

  // 驗證
  if (!title) return NextResponse.json({ error: "title 必填" }, { status: 400 });
  if (!youtubeUrl) return NextResponse.json({ error: "youtubeUrl 必填" }, { status: 400 });
  if (!/^https?:\/\/(www\.)?youtube\.com\/embed\//.test(youtubeUrl)) {
    return NextResponse.json(
      { error: "youtubeUrl 必須是 https://www.youtube.com/embed/VIDEO_ID 格式" },
      { status: 400 }
    );
  }
  if (rawQs.length < 3) {
    return NextResponse.json({ error: "至少需要 3 題" }, { status: 400 });
  }

  const questions: Question[] = rawQs.map((q, i) => {
    const choices = (q.choices ?? []).slice(0, 4);
    while (choices.length < 4) choices.push("");
    const answerIndex = Math.max(0, Math.min(3, Math.floor(q.answerIndex ?? 0)));
    return {
      id: `q${i + 1}`,
      prompt: (q.prompt ?? "").trim() || `題目 ${i + 1}`,
      choices,
      answerIndex,
    };
  });

  const slug = (title || "course")
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "course";

  const course: Course = {
    id: `${slug}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    description: description || "(無描述)",
    youtubeUrl,
    createdAt: Date.now(),
    questions,
  };
  await addCourse(course);
  return NextResponse.json({ course }, { status: 201 });
}
