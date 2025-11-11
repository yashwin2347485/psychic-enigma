import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, regNumber, email, cgpa, department, password } = body;

    if (!name || !regNumber || !email || !cgpa || !department || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const student = await prisma.student.create({
      data: {
        studentId: regNumber, 
        name,
        email,
        cgpa: parseFloat(cgpa),
        department,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Student created", student }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error creating student" }, { status: 500 });
  }
}
