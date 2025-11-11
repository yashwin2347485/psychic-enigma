import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const studentId = searchParams.get("studentId");

  try {
    if (type === "profile" && studentId) {
      const student = await prisma.student.findUnique({
        where: { studentId },
        select: {
          studentId: true,
          name: true,
          department: true,
          cgpa: true,
          email: true,
        },
      });

      if (!student)
        return NextResponse.json({ error: "Student not found" }, { status: 404 });

      return NextResponse.json(student);
    }

    if (type === "jobs") {
      const jobs = await prisma.job.findMany({
        include: { company: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(jobs);
    }

    if (type === "applications" && studentId) {
      const applications = await prisma.application.findMany({
        where: { studentId },
        include: {
          job: { include: { company: true } },
        },
      });
      return NextResponse.json(applications);
    }

    return NextResponse.json({ error: "Invalid query type" }, { status: 400 });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
