import { NextRequest, NextResponse } from "next/server";
import { getCourseStats } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const stats = await getCourseStats(params.id);
  if (!stats) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  return NextResponse.json({ stats });
}
