import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CoursePage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  if (!course) notFound();

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

      <section className="section">
        <h2 className="section-title">作答</h2>
        <p className="hint">M3 會加上 Email 欄位 + 收卷 POST — 接下來再做。</p>
      </section>

      <nav className="nav">
        <a href={`/admin/c/${course.id}/stats`}>📊 看統計</a>
      </nav>
    </main>
  );
}
