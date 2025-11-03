require("dotenv").config({ path: __dirname + "/.env" }); // ensure correct .env is loaded
const express = require("express");
const prisma = require("./prismaClient");

const app = express();
app.use(express.json());

// health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// companies
app.get("/api/companies", async (req, res) => {
  const rows = await prisma.company.findMany();
  res.json(rows);
});

app.post("/api/companies", async (req, res) => {
  const data = req.body;
  const created = await prisma.company.create({ data });
  res.status(201).json(created);
});

// campaigns with company
app.get("/api/campaigns", async (req, res) => {
  const campaigns = await prisma.campaign.findMany({ include: { company: true } });
  res.json(campaigns);
});

app.post("/api/campaigns", async (req, res) => {
  const data = req.body;
  const created = await prisma.campaign.create({ data });
  res.status(201).json(created);
});

// creators and their applications
app.post("/api/creators", async (req, res) => {
  const created = await prisma.creator.create({ data: req.body });
  res.status(201).json(created);
});

app.get("/api/creators/:id", async (req, res) => {
  const id = Number(req.params.id);
  const creator = await prisma.creator.findUnique({
    where: { id },
    include: { applications: { include: { campaign: true } }, reviews: true },
  });
  if (!creator) return res.status(404).json({ error: "Not found" });
  res.json(creator);
});

app.get("/api/creators/:id/campaigns", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { applications: { some: { creatorId: id } } },
      include: { company: true },
    });
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load campaigns" });
  }
});

// applications
app.post("/api/applications", async (req, res) => {
  const created = await prisma.application.create({ data: req.body });
  res.status(201).json(created);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}`));