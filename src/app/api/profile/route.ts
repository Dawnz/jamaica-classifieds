export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { name, phone, parish, bio, image, currentPassword, newPassword } =
    await req.json();

  if (newPassword) {
    if (!currentPassword)
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 },
      );
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.password)
      return NextResponse.json(
        { error: "Cannot change password for social login accounts" },
        { status: 400 },
      );
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    if (newPassword.length < 8)
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 },
      );
  }

  const updateData: any = {
    name: name?.trim(),
    phone: phone?.trim() || null,
    parish: parish || null,
    bio: bio?.trim() || null,
    image: image || null,
  };

  if (newPassword) updateData.password = await bcrypt.hash(newPassword, 12);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      parish: true,
      image: true,
    },
  });

  return NextResponse.json(updated);
}
