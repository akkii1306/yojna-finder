import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import YojanaCard from "@/components/yojana/YojanaCard";

async function getAIRecommendations() {
  try {
    const res = await fetch("http://localhost:3000/api/ai/recommend", {
      cache: "no-store",
    });

    if (!res.ok) return { ai: [] };

    const data = await res.json();
    if (!data || !Array.isArray(data.ai)) return { ai: [] };

    return data;
  } catch {
    return { ai: [] };
  }
}

export default async function YojanaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Please login to view Yojana recommendations.
      </div>
    );
  }

  // Fetch user + profile
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  });

  if (!user?.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Complete your profile to view recommendations.
      </div>
    );
  }

  const p = user.profile;

  // Safe extracted values for TS
  const age = p.age ?? 0;
  const income = p.income ?? 0;
  const disability = p.disability ?? false;

  // Fetch all Yojanas
  const yojanas = await prisma.yojana.findMany({
    include: {
      eligibilityRules: true,
      requiredDocuments: true,
    },
  });

  // RULE-BASED FILTER
  const eligible = yojanas.filter((y) => {
    const r = y.eligibilityRules[0];
    if (!r) return false;

    if (r.minAge && age < r.minAge) return false;
    if (r.maxAge && age > r.maxAge) return false;

    if (r.gender && r.gender.toLowerCase() !== p.gender?.toLowerCase()) return false;

    if (r.maxIncome && income > r.maxIncome) return false;

    if (r.category && r.category.toLowerCase() !== p.category?.toLowerCase()) return false;

    if (r.state && r.state !== p.state) return false;

    if (r.occupation && r.occupation !== p.occupation) return false;

    if (r.disability !== null && r.disability !== disability) return false;

    return true;
  });

  // AI LAYER
  const aiData = await getAIRecommendations();
  const useAI = aiData?.ai?.length > 0;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">
        {useAI ? "AI Enhanced Recommendations" : "Recommended Yojanas"}
      </h1>

      {/* --- AI RESULTS --- */}
      {useAI && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiData.ai.map((x: any, index: number) => (
            <YojanaCard
              key={index}
              title={x.title}
              score={x.score}
              why={x.why}
              documents={x.documents || []}
              category={x.category || ""}
              state={x.state || ""}
            />
          ))}
        </div>
      )}

      {/* --- RULE-BASED RESULTS --- */}
      {!useAI && (
        <>
          {eligible.length === 0 ? (
            <div className="text-gray-600 text-lg">
              No matching schemes found for your profile.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eligible.map((y) => (
                <YojanaCard
                  key={y.id}
                  title={y.title}
                  score={null} // SAFE NOW ✔
                  why={y.description}
                  documents={y.requiredDocuments.map((d) => d.name)}
                  category={y.category}
                  state={y.state}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
