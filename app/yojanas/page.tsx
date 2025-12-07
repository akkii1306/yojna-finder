import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export default async function YojanaPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
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

  // Fetch yojanas
  const yojanas = await prisma.yojana.findMany({
    include: {
      eligibilityRules: true,
      requiredDocuments: true,
    },
  });

  // Apply eligibility rules
  const eligible = yojanas.filter((y) => {
    const r = y.eligibilityRules[0];

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

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Recommended Yojanas</h1>

      {eligible.length === 0 && (
        <p>No matching schemes found for your profile.</p>
      )}

      {eligible.map((y) => (
        <div key={y.id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-bold">{y.title}</h2>
          <p className="mt-2">{y.description}</p>

          <a
            href={y.link}
            target="_blank"
            className="text-blue-600 underline mt-3 inline-block"
          >
            Apply Here
          </a>

          <h3 className="mt-4 font-semibold">Required Documents:</h3>
          <ul className="list-disc ml-6">
            {y.requiredDocuments.map((doc) => (
              <li key={doc.id}>{doc.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
