require("dotenv").config({ path: __dirname + "/.env" });
const bcrypt = require("bcrypt");
const prisma = require("./prismaClient");

async function seed() {
  try {
    console.log("Clearing existing data...");
    await prisma.application.deleteMany();
    await prisma.review.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.creator.deleteMany();
    await prisma.company.deleteMany();

    // Create hashed passwords
    const alicePassword = await bcrypt.hash("alice123", 10);
    const bobPassword = await bcrypt.hash("bob123", 10);

    console.log("Creating creators (users)...");
    const alice = await prisma.creator.create({
      data: {
        username: "alice",
        email: "alice@example.com",
        passwordHash: alicePassword,
        about: "Developer and content creator focused on backend systems.",
      },
    });

    const bob = await prisma.creator.create({
      data: {
        username: "bob",
        email: "bob@example.com",
        passwordHash: bobPassword,
        about: "Front-end engineer and part-time creator.",
      },
    });

    console.log("Creating companies with websites...");
    const swettybetty = await prisma.company.create({
      data: {
        name: "Sweaty Betty",
        website: "https://www.sweatybetty.com/eu/about-us/the-sweaty-betty-story",
        description: "Women's activewear and lifestyle brand.",
      },
    });

    const shook = await prisma.company.create({
      data: {
        name: "Shook Digital",
        website: "https://shook.digital",
        description: "Digital marketing and content creation agency.",
      },
    });

    const nokia = await prisma.company.create({
      data: {
        name: "Nokia",
        website: "https://www.nokia.com/we-are-nokia/",
        description: "Finland's leading telecommunications company.",
      },
    });

    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30); // 30 days ago
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days from now

    console.log("Creating campaigns...");
    const campaign1 = await prisma.campaign.create({
      data: {
        companyId: swettybetty.id,
        title: "Backend Developer Campaign",
        payoutMin: 50000,
        payoutMax: 90000,
        currency: "EUR",
        platforms: ["LinkedIn", "GitHub"],
        requirements: "5+ years Node.js experience",
        location: "Helsinki, Finland",
        tags: ["backend", "nodejs", "remote-ok"],
        deadline: futureDate,
      },
    });

    const campaign2 = await prisma.campaign.create({
      data: {
        companyId: shook.id,
        title: "Social Media Campaign",
        payoutMin: 2000,
        payoutMax: 5000,
        currency: "EUR",
        platforms: ["Instagram", "TikTok"],
        requirements: "Min 10k followers, engagement rate > 3%",
        location: "Remote",
        tags: ["social-media", "content-creation"],
        deadline: pastDate, 
      },
    });

    const campaign3 = await prisma.campaign.create({
      data: {
        companyId: nokia.id,
        title: "Frontend Developer",
        payoutMin: 45000,
        payoutMax: 75000,
        currency: "EUR",
        platforms: ["LinkedIn"],
        requirements: "React expertise required",
        location: "Espoo, Finland",
        tags: ["frontend", "react", "typescript"],
        deadline: futureDate, 
      },
    });

    console.log("Creating applications (campaign-creator connections)...");
    // Alice applies to backend and frontend roles
    await prisma.application.create({
      data: {
        creatorId: alice.id,
        campaignId: campaign1.id,
        status: "accepted",
      },
    });

    await prisma.application.create({
      data: {
        creatorId: alice.id,
        campaignId: campaign3.id,
        status: "pending",
      },
    });

    // Bob applies to social media and frontend roles
    await prisma.application.create({
      data: {
        creatorId: bob.id,
        campaignId: campaign2.id,
        status: "accepted",
      },
    });

    await prisma.application.create({
      data: {
        creatorId: bob.id,
        campaignId: campaign3.id,
        status: "rejected",
      },
    });

    console.log("Creating reviews...");
    await prisma.review.create({
      data: {
        creatorId: alice.id,
        companyId: swettybetty.id,
        rating: 5,
        comment: "Great company to work with!",
      },
    });

    await prisma.review.create({
      data: {
        creatorId: bob.id,
        companyId: shook.id,
        rating: 4,
        comment: "Good communication and fair compensation.",
      },
    });

    console.log("\nTest credentials:");
    console.log("Alice - email: alice@example.com, password: alice123");
    console.log("Bob - email: bob@example.com, password: bob123");

    console.log("\nSeeding finished successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();