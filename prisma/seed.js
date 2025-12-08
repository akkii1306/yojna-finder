import prisma from "../lib/prisma.js";


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
          { name: "Aadhar Card", description: "Valid Aadhaar linked with bank" },
          { name: "Land Ownership Proof", description: "Khasra/Khatauni or similar" },
          { name: "Bank Account Details", description: "Passbook or cancelled cheque" },
        ],
      },
    },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
