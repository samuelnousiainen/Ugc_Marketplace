require("dotenv").config({ path: __dirname + "/.env" });
const prisma = require("./prismaClient");

async function seed() {
  try {
    console.log("Clearing existing data...");
    await prisma.application.deleteMany();
    await prisma.review.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.creator.deleteMany();
    await prisma.company.deleteMany();

    console.log("Creating companies + campaigns...");
    const company1 = await prisma.company.create({
      data: {
        name: "Northwind Systems",
        website: "https://northwind.example",
        description: "Enterprise software and cloud solutions.",
        campaigns: {
          create: [
            {
              title: "Backend Developer",
              payoutMin: 50000,
              payoutMax: 90000,
              currency: "EUR",
              platforms: ["youtube", "tiktok"],
              requirements: "Experience with Node.js and databases",
              location: "Espoo, Finland",
              tags: ["nodejs", "backend", "remote"],
            },
            {
              title: "Frontend Developer",
              payoutMin: 45000,
              payoutMax: 80000,
              currency: "EUR",
              platforms: ["instagram"],
              requirements: "React + TypeScript experience",
              location: "Helsinki, Finland",
              tags: ["react", "frontend"],
            },
          ],
        },
      },
      include: { campaigns: true },
    });

    const company2 = await prisma.company.create({
      data: {
        name: "Aurora Media",
        website: "https://auroramedia.example",
        description: "Creative agency focused on social-first campaigns.",
        campaigns: {
          create: [
            {
              title: "Content Creator for Instagram",
              payoutMin: 800,
              payoutMax: 2500,
              currency: "EUR",
              platforms: ["instagram"],
              requirements: "Strong visual storytelling",
              deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // +30 days
              location: "Remote",
              tags: ["creator", "instagram"],
            },
          ],
        },
      },
      include: { campaigns: true },
    });

    console.log("Creating creators (users)...");
    const alice = await prisma.creator.create({
      data: {
        username: "alice",
        email: "alice@example.com",
        passwordHash: "hashed-password-alice",
        about: "Developer and content creator focused on backend systems.",
      },
    });

    const bob = await prisma.creator.create({
      data: {
        username: "bob",
        email: "bob@example.com",
        passwordHash: "hashed-password-bob",
        about: "Front-end engineer and part-time creator.",
      },
    });

    console.log("Creating applications and reviews...");
    // apply alice to Northwind backend campaign
    await prisma.application.create({
      data: {
        creatorId: alice.id,
        campaignId: company1.campaigns[0].id,
        status: "pending",
      },
    });

    // bob applies to Aurora campaign
    const auroraCampaignId = company2.campaigns[0].id;
    await prisma.application.create({
      data: {
        creatorId: bob.id,
        campaignId: auroraCampaignId,
        status: "accepted",
      },
    });

    // reviews
    await prisma.review.create({
      data: {
        creatorId: alice.id,
        companyId: company2.id,
        rating: 5,
        comment: "Great and fast communication.",
      },
    });

    await prisma.review.create({
      data: {
        creatorId: bob.id,
        companyId: company1.id,
        rating: 4,
        comment: "Good brief, payment on time.",
      },
    });

    console.log("Seeding finished.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();