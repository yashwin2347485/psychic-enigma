import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Handle GET requests — fetch dashboard data dynamically
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // 🔹 Fetch Companies
    if (type === "companies") {
      const companies = await prisma.company.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(companies);
    }

    // 🔹 Fetch Jobs with Company Info
    if (type === "jobs") {
      const jobs = await prisma.job.findMany({
        include: { company: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(jobs);
    }

    // 🔹 Fetch Applications (JOIN view style)
    if (type === "applications") {
      const applications = await prisma.application.findMany({
        include: {
          student: { select: { name: true } },
          job: { include: { company: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      const formatted = applications.map((app) => ({
        id: app.id,
        studentName: app.student.name,
        jobTitle: app.job.title,
        companyName: app.job.company.name,
        status: app.status,
      }));

      return NextResponse.json(formatted);
    }

    // 🔹 Default summary data
    const [companyCount, jobCount, applicationCount] = await Promise.all([
      prisma.company.count(),
      prisma.job.count(),
      prisma.application.count(),
    ]);

    return NextResponse.json({
      companies: companyCount,
      jobs: jobCount,
      applications: applicationCount,
    });
  } catch (error) {
    console.error("❌ GET /api/admin error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}

// ✅ Handle POST requests — Add new company or job
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    // 🔹 Add New Company
    if (type === "company") {
      const { name, email, industry, location } = body;

      if (!name || !email || !industry || !location) {
        return NextResponse.json(
          { error: "Missing required company fields" },
          { status: 400 }
        );
      }

      const newCompany = await prisma.company.create({
        data: {
          name,
          email,
          industry,
          location,
          status: "Active",
        },
      });

      return NextResponse.json(newCompany);
    }

    // 🔹 Add New Job
    if (type === "job") {
      const { title, package: pkg, companyId } = body;

      if (!title || !pkg || !companyId) {
        return NextResponse.json(
          { error: "Missing required job fields" },
          { status: 400 }
        );
      }

      const newJob = await prisma.job.create({
        data: {
          title,
          package: parseFloat(pkg),
          companyId,
          status: "Open",
        },
      });

      return NextResponse.json(newJob);
    }

    return NextResponse.json({ error: "Invalid POST type" }, { status: 400 });
  } catch (error) {
    console.error("❌ POST /api/admin error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}
