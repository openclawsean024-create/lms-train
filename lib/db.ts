import { promises as fs } from "fs";
import * as path from "path";
import { Course, Submission, Stats } from "./types";

/**
 * Demo 模式資料層:
 * - 讀取: 先 seed.json, 然後 /tmp/data.json (使用者新增)
 * - 寫入: /tmp/data.json
 * - Vercel serverless 是 read-only filesystem,所以 /tmp 是唯一可寫位置
 * - 同一 instance 持久; cold start 重置
 */

const SEED_PATH = path.join(process.cwd(), "data", "seed.json");
const RUNTIME_PATH = "/tmp/lms-train-data.json";

type RuntimeData = {
  courses: Course[];
  submissions: Submission[];
};

async function ensureRuntime(): Promise<RuntimeData> {
  try {
    const raw = await fs.readFile(RUNTIME_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    // 第一次跑,把 seed 寫進去
    const seedRaw = await fs.readFile(SEED_PATH, "utf-8");
    const seedCourses: Course[] = JSON.parse(seedRaw);
    const data: RuntimeData = { courses: seedCourses, submissions: [] };
    await fs.writeFile(RUNTIME_PATH, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
}

async function saveRuntime(data: RuntimeData): Promise<void> {
  await fs.writeFile(RUNTIME_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function listCourses(): Promise<Course[]> {
  const data = await ensureRuntime();
  return data.courses;
}

export async function getCourse(id: string): Promise<Course | null> {
  const data = await ensureRuntime();
  return data.courses.find((c) => c.id === id) ?? null;
}

export async function addCourse(course: Course): Promise<Course> {
  const data = await ensureRuntime();
  data.courses.push(course);
  await saveRuntime(data);
  return course;
}

export async function addSubmission(sub: Submission): Promise<Submission> {
  const data = await ensureRuntime();
  data.submissions.push(sub);
  await saveRuntime(data);
  return sub;
}

export async function getSubmission(id: string): Promise<Submission | null> {
  const data = await ensureRuntime();
  return data.submissions.find((s) => s.id === id) ?? null;
}

export async function getCourseStats(courseId: string): Promise<Stats | null> {
  const data = await ensureRuntime();
  const course = data.courses.find((c) => c.id === courseId);
  if (!course) return null;
  const subs = data.submissions.filter((s) => s.courseId === courseId);
  const total = subs.length;
  const avg = total === 0 ? 0 : Math.round(subs.reduce((a, s) => a + s.score, 0) / total);
  const perQuestion = course.questions.map((q) => {
    let correct = 0;
    let answered = 0;
    for (const s of subs) {
      const idx = course.questions.findIndex((qq) => qq.id === q.id);
      if (idx >= 0 && idx < s.answers.length) {
        answered += 1;
        if (s.answers[idx] === q.answerIndex) correct += 1;
      }
    }
    return {
      qid: q.id,
      prompt: q.prompt,
      correctRate: answered === 0 ? 0 : Math.round((correct / answered) * 100),
      totalAnswers: answered,
    };
  });
  return { total, avg, perQuestion };
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function randomId(prefix = "id"): string {
  const r = Math.random().toString(36).slice(2, 8);
  const t = Date.now().toString(36).slice(-4);
  return `${prefix}-${t}${r}`;
}
