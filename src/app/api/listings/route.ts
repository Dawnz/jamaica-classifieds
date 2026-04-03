export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendListingConfirmEmail } from "@/lib/email/send";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const now = new Date();
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(48, Number(searchParams.get("limit") ?? 24));
  const skip = (page - 1) * limit;

  const category = searchParams.get("category");
  const parish = searchParams.get("parish");
  const q = searchParams.get("q");
  const tier = searchParams.get("tier");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const categoryRecord = category
    ? await prisma.category.findUnique({ where: { slug: category } })
    : null;

  const where: any = {
    status: "ACTIVE",
    expiresAt: { gt: now },
    ...(categoryRecord ? { categoryId: categoryRecord.id } : {}),
    ...(parish ? { parish } : {}),
    ...(tier ? { tier } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(minPrice || maxPrice
      ? {
          price: {
            ...(minPrice ? { gte: Number(minPrice) } : {}),
            ...(maxPrice ? { lte: Number(maxPrice) } : {}),
          },
        }
      : {}),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ tier: "desc" }, { createdAt: "desc" }],
      include: { images: { take: 1 }, category: true },
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    listings,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    title,
    description,
    price,
    priceLabel,
    parish,
    categoryId,
    subCategoryId,
    contactName,
    contactPhone,
    contactEmail,
    fields,
    imageUrls,
    tier,
  } = body;

  if (!title || !description || !parish || !categoryId)
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (tier === "PREMIUM" ? 60 : 30));

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      price: price ? Number(price) : null,
      priceLabel,
      parish,
      categoryId,
      subCategoryId: subCategoryId ?? null,
      contactName,
      contactPhone,
      contactEmail,
      userId: (session.user as any).id,
      tier: tier ?? "FREE",
      status: "ACTIVE",
      expiresAt,
      fields: {
        create: (fields ?? []).map((f: any) => ({
          key: f.key,
          label: f.label,
          value: f.value,
        })),
      },
      images: {
        create: (imageUrls ?? []).map((url: string, i: number) => ({
          url,
          order: i,
        })),
      },
    },
  });
  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });
  if (user?.email) {
    sendListingConfirmEmail(user.email, user.name ?? "there", {
      id: listing.id,
      title: listing.title,
      priceLabel: listing.priceLabel,
      parish: listing.parish,
      expiresAt: listing.expiresAt,
      tier: listing.tier,
    });
  }
  return NextResponse.json(listing, { status: 201 });
}

