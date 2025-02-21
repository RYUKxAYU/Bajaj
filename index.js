const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const mongoUrl = process.env.MONGO_URL;
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
  status: String,
  userId: String,
  email: String,
  rNo: String,
  Ano: String,
  aAlp: String,
});

const User = mongoose.model("User", userSchema);

// GET route (fixing original logic)
app.get("/bfhl", async (req, res) => {
  try {
    const { status, userId, email, rNo, aNo, aAlp } = req.query;

    if (!status && !userId && !email && !rNo && !aNo && !aAlp) {
      return res.status(400).json({ msg: "No query parameters provided" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      Status: user.status,
      "User ID": user.userId,
      Email: user.email,
      "College Roll No": user.rNo,
      "Array for Numbers": user.Ano,
      "Array for Alphabets": user.aAlp,
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

// POST route (create user)
app.post("/bfhl", async (req, res) => {
  try {
    const { status, userId, email, rNo, Ano, aAlp } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const newUser = new User({ status, userId, email, rNo, Ano, aAlp });
    await newUser.save();

    res.status(201).json({ msg: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
