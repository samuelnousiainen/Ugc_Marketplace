require("dotenv").config({ path: __dirname + "/.env" }); 
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authMiddleware, JWT_SECRET } = require("./middleware/auth");
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

// get company website URL by id
app.get("/api/companywebsite/:id", async (req, res) => {
  const row = await prisma.company.findUnique({
    where: {id: Number(req.params.id)}, select: { website: true }
  });
  res.json({ website: row.website });
});

// campaigns with company
app.get("/api/campaigns", async (req, res) => {
  const campaigns = await prisma.campaign.findMany({ include: { company: true } });
  res.json(campaigns);
});

// new: get single campaign by id
app.get("/api/campaigns/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const campaign = await prisma.campaign.findUnique({ where: { id }, include: { company: true } });
  if (!campaign) return res.status(404).json({ error: "Not found" });
  res.json(campaign);
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

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const creator = await prisma.creator.findUnique({ where: { email } });
    if (!creator) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, creator.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: creator.id, email: creator.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, creator: { id: creator.id, username: creator.username, email: creator.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected route - get creator profile
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const creator = await prisma.creator.findUnique({
      where: { id: req.user.id },
      include: {
        applications: {
          include: {
            campaign: {
              include: { company: true }
            }
          }
        }
      }
    });
    
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    res.json(creator);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}`));