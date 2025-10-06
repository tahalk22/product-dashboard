// backend/index.js
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
//const serviceAccount = require("./serviceAccountKey.json");
const serviceAccount = require("./commerc-ec055-firebase-adminsdk-fbsvc-6498f6c2d8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// API لإنشاء مستخدم جديد
app.post("/api/create-user", async (req, res) => {
   console.log("تم استقبال طلب إنشاء مستخدم:", req.body); // أضف هذا السطر
  const { email, password, role } = req.body;

  try {
    const userRecord = await admin.auth().createUser({ email, password });
    await db.collection("users").doc(userRecord.uid).set({ role });

    res.status(201).send("✅ تم إنشاء المستخدم بنجاح");
  } catch (err) {
    console.error("خطأ:", err);
    res.status(500).send("❌ فشل في إنشاء المستخدم"  +err.message);
  }
});


app.get("/", (req, res) => {
  res.send("مرحبًا بك في API المستخدمين");
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
