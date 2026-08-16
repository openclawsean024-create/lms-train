import { NextRequest, NextResponse } from "next/server";
import { getSubmission, getCourse } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const sub = await getSubmission(params.id);
  if (!sub) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  const course = await getCourse(sub.courseId);
  // 為了避免洩漏考試答案,從 course 取不含 answerIndex 的版本
  const courseSafe = course
    ? {
        id: course.id,
        title: course.title,
        questions: course.questions.map((q) => ({
          id: q.id,
          prompt: q.prompt,
          choices: q.choices,
        })),
      }
    : null;
  return NextResponse.json({ submission: sub, course: courseSafe });
}
