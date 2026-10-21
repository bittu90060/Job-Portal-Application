require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

(async () => {
  try {
    if (
      !process.env.MONGO_URI ||
      !process.env.ADMIN_EMAIL ||
      !process.env.ADMIN_PASSWORD
    ) {
      throw new Error(
        "Set MONGO_URI, ADMIN_EMAIL, and ADMIN_PASSWORD in .env first.",
      );
    }
    if (process.env.ADMIN_PASSWORD.length < 12)
      throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    const admin = await User.findOneAndUpdate(
      { email },
      { name: "Portal Admin", email, password, role: "admin" },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log(`Admin ready: ${admin.email}`);
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
})();
