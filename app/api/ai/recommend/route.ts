import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  });

  if (!user?.profile) {
    return NextResponse.json({ error: "Profile missing" }, { status: 400 });
  }

  const p = user.profile;

  const yojanas = await prisma.yojana.findMany({
    include: {
      eligibilityRules: true,
      requiredDocuments: true,
    },
  });

  const eligible = yojanas.filter((y) => {
    const r = y.eligibilityRules[0];
    if (!r) return false;

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

  if (eligible.length === 0) {
    return NextResponse.json({ ai: [] });
  }

  const prompt = `
  A citizen has the following profile:
  ${JSON.stringify(p, null, 2)}

  These are the government schemes they are eligible for:
  ${JSON.stringify(eligible, null, 2)}

  For EACH scheme, evaluate:
  - Fit score (0–100)
  - Why it matches the user (2–3 sentences)
  - Required documents

  Return JSON ONLY:
  [
    {
      "yojanaId": "",
      "title": "",
      "score": 0,
      "why": "",
      "documents": []
    }
  ]
  `;

  // REAL GEMINI CALL
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const json = await response.json();

  const output = json.candidates?.[0]?.content?.parts?.[0]?.text;

  let parsed = [];
  try {
    parsed = JSON.parse(output);
  } catch {
    parsed = [];
  }

  return NextResponse.json({ ai: parsed });
}
