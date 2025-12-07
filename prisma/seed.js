import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.yojana.create({
    data: {
      title: "PM Kisan Samman Nidhi",
      description: "Income support of ₹6000 per year to farmer families.",
      category: "Agriculture",
      state: null,
      link: "https://pmkisan.gov.in",
      eligibilityRules: {
        create: {
          minAge: 18,
          occupation: "Farmer",
          maxIncome: 200000,
        },
      },
      requiredDocuments: {
        create: [
          { name: "Aadhar Card" },
          { name: "Land Ownership Proof" },
          { name: "Bank Account Details" },
        ],
      },
    },
  });

  console.log("Seed completed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
