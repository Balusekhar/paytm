const express = require("express");
const router = express.Router();
const z = require("zod");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config");
const user = require("../db");

const signupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  userName: z.string(),
  password: z.string(),
});

const signinBody = zod.object({
  username: zod.string().email(),
password: zod.string()
})

router.post("/signup", async (req, res) => {
  const { firstName, lastName, userName, password } = req.body;

  try {
    const result = signupSchema.safeParse({
      firstName,
      lastName,
      userName,
      password,
    });

    if (!result.success) {
      return res
        .status(400)
        .json({ error: "Incorrect Inputs", details: result.error.errors });
    }

    let checkUserExistence = await user.findOne({ userName });
    if (checkUserExistence) {
      return res.status(400).json({ error: "User already exists" });
    }

    let newUser = new user.User({
      firstName,
      lastName,
      userName,
      password,
    });

    const savedUser = await newUser.save();
    const signature = jwt.sign({ userId: savedUser._id }, jwtSecret);
    return res
      .status(200)
      .json({ message: "User saved successfully", signature });
  } catch (e) {
    return res
      .status(400)
      .json({ error: "Invalid input.", details: e.message });
  }
});

router.post("/signin", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const result = signinSchema.safeParse({ userName, password });

    if (!result.success) {
      return res.status(400).json({ error: "Incorrect Inputs", details: result.error.errors });
    }

    // Find the user in the database
    const existingUser = await user.findOne({ userName, password });

    // Check if the user exists
    if (!existingUser) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error while logging in", details: error.message });
  }
});

module.exports = router;
