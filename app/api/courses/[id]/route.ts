import { NextRequest, NextResponse } from "next/server";
import { getCourse } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  return NextResponse.json({ course });
}
