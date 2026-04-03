export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email/send";
export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!email || !password || password.length < 8)
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );

    if (!name || name.trim().length < 2)
      return NextResponse.json(
        { error: "Please enter your full name" },
        { status: 400 },
      );

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashed,
        phone: phone?.trim() || null,
      },
    });
    sendWelcomeEmail(email, name.trim());
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

