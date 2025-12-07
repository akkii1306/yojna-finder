import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  });

  if (!user?.profile) {
    return NextResponse.json({ error: "Profile incomplete" }, { status: 400 });
  }

  const p = user.profile;

  // Fetch all schemes
  const yojanas = await prisma.yojana.findMany({
    include: {
      eligibilityRules: true,
      requiredDocuments: true,
    },
  });

  // Filter based on rules
  const eligible = yojanas.filter((y) => {
    const r = y.eligibilityRules[0]; // (1 rule for now)

    if (r.minAge && p.age < r.minAge) return false;
    if (r.maxAge && p.age > r.maxAge) return false;
    if (r.gender && r.gender !== p.gender) return false;
    if (r.maxIncome && p.income > r.maxIncome) return false;
    if (r.category && r.category !== p.category) return false;
    if (r.state && r.state !== p.state) return false;
    if (r.occupation && r.occupation !== p.occupation) return false;
    if (r.disability != null && r.disability !== p.disability) return false;

    return true;
  });

  return NextResponse.json({ eligible });
}
