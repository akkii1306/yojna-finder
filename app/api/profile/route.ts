import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();

  const {
    age,
    gender,
    state,
    district,
    income,
    category,
    occupation,
    disability,
  } = body;

  // upsert = update if exists, otherwise create
  const profile = await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {
      age,
      gender,
      state,
      district,
      income,
      category,
      occupation,
      disability,
    },
    create: {
      userId: user.id,
      age,
      gender,
      state,
      district,
      income,
      category,
      occupation,
      disability,
    },
  });

  return NextResponse.json({ profile }, { status: 200 });
}
