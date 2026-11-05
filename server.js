
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "bims-data.json");

const initialData = {
  profile: {
    id: 1,
    name: "Louise Zyril U. Macape",
    nickname: "Louise",
    email: "louise.macape@example.com",
    address: "Barangay Mocag, Baggao, Cagayan",
    residentSince: "2024",
    role: "Resident"
  },
  residents: [
    "Yna Mariah Israel", "Khen Lasaca", "AJ Macapulay",
    "Ci Israel", "Jed Lagoc", "Jazel Mercado",
    "Ken Lester Nonat", "Lowie Bosque", "Adrian Manzano",
    "Joana Bautista", "Hazel Dilla",
    "Louise Zyril U. Macape", "Howaren Cabatan",
    "Ernest Cabatan", "Vincent Jhon Dumlao",
    "Christian Udaundo", "Rowena Rodriguez",
    "Fernando Venus", "Albert Barcena"
  ].map((name, index) => ({
    id: `MOCAG-${String(index + 1).padStart(4, "0")}`,
    name,
    address: "Barangay Mocag, Baggao, Cagayan",
    status: "Active"
  })),
  officials: [
    { name: "Albert Barcena", position: "Barangay Captain" },
    { name: "Vincent Jhon Dumlao", position: "SK Chairman" },
    { name: "Rowena Rodriguez", position: "Barangay Secretary" },
    { name: "Fernando Venus", position: "Barangay Auditor" },
    { name: "Christian Udaundo", position: "SK Official" }
  ],
  announcements: [
    {
      id: 1,
      title: "Barangay Assembly",
      body: "All residents are encouraged to attend the upcoming barangay assembly. Please coordinate with barangay officials for the schedule.",
      date: "2026-11-05",
      category: "Community"
    },
    {
      id: 2,
      title: "Community Clean-Up",
      body: "Residents are invited to participate in the community clean-up drive. Keep our surroundings clean and safe.",
      date: "2026-11-05",
      category: "Environment"
    },
    {
      id: 3,
      title: "Health Center Reminder",
      body: "Visit the barangay health center for available consultations and health services.",
      date: "2026-11-05",
      category: "Health"
    }
  ],
  reports: [],
  certificates: [],
  notifications: [],
  messages: [],
  archived: []
};

function saveData(data) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function loadData() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    saveData(initialData);
  }

  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch {
    saveData(initialData);
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  }
}

let db = loadData();

const certificates = [
  {
    name: "Certificate of Residency",
    requirements: ["Valid ID", "Proof of residence"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Submit your request to the Barangay Secretary.",
      "Present your valid ID and proof of residence.",
      "Wait for resident verification.",
      "Proceed to the authorized signatory.",
      "Pay the applicable fee, if any, and claim your certificate."
    ]
  },
  {
    name: "Certificate of Indigency",
    requirements: ["Valid ID", "Proof of residence", "Purpose of request"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Submit your request to the Barangay Secretary.",
      "Present your valid ID and proof of residence.",
      "Undergo verification of your request.",
      "Wait for approval by the authorized official.",
      "Claim your certificate when notified."
    ]
  },
  {
    name: "Certificate of Good Moral Character",
    requirements: ["Valid ID", "Proof of residence", "Purpose of request"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Visit the Barangay Secretary.",
      "Submit your identification and request.",
      "Complete the required verification.",
      "Wait for the authorized signatory.",
      "Claim your certificate."
    ]
  },
  {
    name: "First-Time Job Seeker",
    requirements: ["Valid ID", "Proof of residence", "First-time job seeker application"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Visit the Barangay Secretary.",
      "Submit your first-time job seeker application.",
      "Present the required identification.",
      "Complete verification.",
      "Claim the certificate after approval."
    ]
  },
  {
    name: "Certificate of Unemployment",
    requirements: ["Valid ID", "Proof of residence", "Supporting information"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Submit your request.",
      "Present required documents.",
      "Complete verification.",
      "Wait for approval.",
      "Claim the certificate."
    ]
  },
  {
    name: "Certificate of No Income",
    requirements: ["Valid ID", "Proof of residence", "Supporting information"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Visit the Barangay Secretary.",
      "Submit the request and supporting documents.",
      "Complete verification.",
      "Wait for approval.",
      "Claim the certificate."
    ]
  },
  {
    name: "Certificate of Actual Residency",
    requirements: ["Valid ID", "Proof of actual residence"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Submit your request.",
      "Present identification and residence proof.",
      "Complete residency verification.",
      "Wait for approval.",
      "Claim the certificate."
    ]
  },
  {
    name: "Certificate of Purok Residency",
    requirements: ["Valid ID", "Purok information", "Proof of residence"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Visit the Barangay Secretary.",
      "Provide your purok information.",
      "Complete residence verification.",
      "Wait for approval.",
      "Claim the certificate."
    ]
  },
  {
    name: "Certificate of Community Membership",
    requirements: ["Valid ID", "Proof of residence"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Submit your request.",
      "Present your ID.",
      "Complete membership verification.",
      "Wait for approval.",
      "Claim the certificate."
    ]
  },
  {
    name: "Certificate of Length of Residency",
    requirements: ["Valid ID", "Supporting residency information"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Submit your request.",
      "Provide your residency history.",
      "Complete verification.",
      "Wait for approval.",
      "Claim the certificate."
    ]
  },
  {
    name: "Certificate of Household Membership",
    requirements: ["Valid ID", "Household information"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Submit your request.",
      "Provide household details.",
      "Complete verification.",
      "Wait for approval.",
      "Claim the certificate."
    ]
  },
  {
    name: "Certificate of Family Composition",
    requirements: ["Valid ID", "List of household members"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Submit your request.",
      "Provide family information.",
      "Complete verification.",
      "Wait for approval.",
      "Claim the certificate."
    ]
  },
  {
    name: "Certificate of Single Status",
    requirements: ["Valid ID", "Supporting information"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Ask the Barangay Secretary about availability.",
      "Submit required documents.",
      "Complete verification.",
      "Wait for approval.",
      "Claim the certificate."
    ]
  },
  {
    name: "Certificate of Live-In Relationship",
    requirements: ["Valid IDs", "Supporting information"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Ask the Barangay Secretary about availability.",
      "Submit required documents.",
      "Complete verification.",
      "Wait for approval.",
      "Claim the certificate."
    ]
  },
  {
    name: "Certificate of Change of Address",
    requirements: ["Valid ID", "Previous and new address information"],
    firstOffice: "Barangay Secretary",
    steps: [
      "Submit your request.",
      "Provide previous and current address.",
      "Complete verification.",
      "Wait for approval.",
      "Claim the certificate."
    ]
  }
];

const communityServices = [
  "Social Welfare and Financial Assistance",
  "Medical and Hospital Assistance Referral",
  "Burial Assistance Referral",
  "Educational Assistance and Scholarship Information",
  "Food Assistance and Relief Goods",
  "Senior Citizen Assistance",
  "PWD Assistance and Referral",
  "Solo Parent Assistance",
  "Women and Children Protection Referral",
  "Family Welfare Services",
  "Disaster Assistance and Emergency Relief",
  "Livelihood and Employment Assistance",
  "Youth Development and Community Programs"
];

const healthServices = [
  "General Consultation and Primary Care",
  "Blood Pressure Monitoring",
  "Blood Glucose Screening (when available)",
  "Health Assessment and Risk Screening",
  "First Aid and Minor Illness Referral",
  "Maternal and Prenatal Care",
  "Pregnancy Health Education",
  "Postpartum and Breastfeeding Support",
  "Family Planning Counseling",
  "Child Immunization",
  "Growth and Development Monitoring",
  "Nutrition and Malnutrition Screening",
  "Vitamin A and Deworming (when offered)",
  "Adolescent Health Education",
  "Home Visits and Follow-Up",
  "Medical Referral and Appointment Coordination"
];

// HEALTH AND DASHBOARD
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "MOCAG BIMS API is running" });
});

app.get("/api/dashboard", (req, res) => {
  res.json({
    residents: db.residents.length,
    officials: db.officials.length,
    announcements: db.announcements.length,
    reports: db.reports.length,
    certificates: db.certificates.length,
    pendingCertificates: db.certificates.filter(
      c => c.status === "Pending"
    ).length
  });
});

// PROFILE
app.get("/api/profile", (req, res) => res.json(db.profile));

app.put("/api/profile", (req, res) => {
  db.profile = {
    ...db.profile,
    ...req.body,
    id: 1,
    role: "Resident"
  };
  saveData(db);
  res.json(db.profile);
});

// RESIDENTS AND OFFICIALS
app.get("/api/residents", (req, res) => {
  const q = String(req.query.search || "").toLowerCase();
  res.json(db.residents.filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.id.toLowerCase().includes(q)
  ));
});

app.get("/api/officials", (req, res) => res.json(db.officials));

// ANNOUNCEMENTS
app.get("/api/announcements", (req, res) => res.json(db.announcements));

// CERTIFICATES
app.get("/api/certificates/options", (req, res) => res.json(certificates));
app.get("/api/certificates", (req, res) => res.json(db.certificates));

app.post("/api/certificates", (req, res) => {
  const { type, purpose } = req.body;
  const definition = certificates.find(c => c.name === type);

  if (!definition || !purpose) {
    return res.status(400).json({
      message: "Choose a certificate and enter its purpose."
    });
  }

  const request = {
    id: `CERT-${Date.now().toString().slice(-8)}`,
    type,
    purpose,
    resident: db.profile.name,
    status: "Pending",
    firstOffice: definition.firstOffice,
    createdAt: new Date().toISOString()
  };

  db.certificates.unshift(request);
  db.notifications.unshift({
    id: Date.now(),
    title: "Certificate request submitted",
    body: `${request.id} is now pending.`,
    date: new Date().toISOString()
  });

  saveData(db);
  res.status(201).json(request);
});

// REPORTS AND CONCERNS
app.get("/api/reports", (req, res) => res.json(db.reports));

app.post("/api/reports", (req, res) => {
  const { title, category, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Enter a title and description."
    });
  }

  const report = {
    id: `RPT-${Date.now().toString().slice(-8)}`,
    title,
    category: category || "General",
    description,
    resident: db.profile.name,
    status: "Submitted",
    createdAt: new Date().toISOString()
  };

  db.reports.unshift(report);
  db.notifications.unshift({
    id: Date.now(),
    title: "Concern submitted",
    body: report.title,
    date: new Date().toISOString()
  });

  saveData(db);
  res.status(201).json(report);
});

// COMMUNITY AND HEALTH SERVICES
app.get("/api/services/community", (req, res) => res.json(communityServices));
app.get("/api/services/health", (req, res) => res.json(healthServices));

// NOTIFICATIONS
app.get("/api/notifications", (req, res) => res.json(db.notifications));

// MESSAGES
app.get("/api/messages", (req, res) => res.json(db.messages));

const badWords = [
  "putangina", "puta", "fuck", "shit",
  "bitch", "asshole", "gago", "tanga",
  "bobo", "pakyu"
];

app.post("/api/messages", (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({
      message: "Recipient and message are required."
    });
  }

  const normalized = message.toLowerCase();
  const containsBadWord = badWords.some(word =>
    new RegExp(`\\b${word}\\b`, "i").test(normalized)
  );

  if (containsBadWord) {
    return res.status(400).json({
      message: "Please use respectful language. Your message contains inappropriate words."
    });
  }

  const item = {
    id: Date.now(),
    from: db.profile.name,
    to,
    message,
    date: new Date().toISOString()
  };

  db.messages.unshift(item);
  saveData(db);
  res.status(201).json(item);
});

// ARCHIVE
app.post("/api/archive", (req, res) => {
  const { type, id } = req.body;

  if (!type || !id) {
    return res.status(400).json({
      message: "Missing archive information."
    });
  }

  db.archived.unshift({
    type,
    id,
    resident: db.profile.name,
    date: new Date().toISOString()
  });

  saveData(db);
  res.json({ message: "Item archived." });
});

app.get("/api/archive", (req, res) => res.json(db.archived));

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "An unexpected server error occurred."
  });
});

app.listen(PORT, () => {
  console.log(`MOCAG BIMS API running at http://localhost:${PORT}`);
});
