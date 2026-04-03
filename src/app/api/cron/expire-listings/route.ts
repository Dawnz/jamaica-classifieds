export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendExpiryWarningEmail, sendExpiredEmail } from "@/lib/email/send";

export async function GET(req: Request) {
  if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const in3days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const expiring = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: {
        gte: new Date(in3days.getTime() - 3600000),
        lte: new Date(in3days.getTime() + 3600000),
      },
    },
    include: { user: { select: { email: true, name: true } } },
  });

  let warningSent = 0;
  for (const l of expiring) {
    if (!l.user.email) continue;
    await sendExpiryWarningEmail(l.user.email, l.user.name ?? "there", {
      id: l.id,
      title: l.title,
      priceLabel: l.priceLabel,
      parish: l.parish,
      expiresAt: l.expiresAt,
      tier: l.tier,
    });
    warningSent++;
  }

  const justExpired = await prisma.listing.findMany({
    where: { status: "ACTIVE", expiresAt: { lte: now } },
    include: { user: { select: { email: true, name: true } } },
  });

  let expiredCount = 0;
  for (const l of justExpired) {
    await prisma.listing.update({
      where: { id: l.id },
      data: { status: "EXPIRED" },
    });
    if (l.user.email)
      await sendExpiredEmail(l.user.email, l.user.name ?? "there", {
        id: l.id,
        title: l.title,
        parish: l.parish,
      });
    expiredCount++;
  }

  return NextResponse.json({
    ok: true,
    warningSent,
    expiredCount,
    ranAt: now.toISOString(),
  });
}

