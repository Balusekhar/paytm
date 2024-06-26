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
      return res.status(400).json({ error: "Incorrect Inputs" });
    }
    let checkUserExistence = await user.findOne({
      userName: req.body.userName,
    });
    if (checkUserExistence) {
      return res.status(400).json({ error: "User Already exists" });
    } else {
      let newUser = new user.User({
        firstName,
        lastName,
        userName,
        password,
      });
      const saveduser = await newUser.save();
      const signature = jwt.sign({ userId: saveduser._id }, jwtSecret);
      return res
        .status(200)
        .json({ message: "User saved successfully", signature: signature });
    }
  } catch (e) {
    res.status(400).json({ error: "Invalid input.", details: e.message });
  }
});

module.exports = router;
