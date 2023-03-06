const express = require("express");
const router = express.Router();
const Model = require("../Schema/postSchema");
const Model2 = require("../Schema/userSchema");
const bcrypt = require("bcryptjs");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const verify = require("../authVerify");

//postMethod
router.post("/createTweet", async (req, res) => {
  const newPost = new Model({ 
    UserId: req.body.UserId,
    tweet: req.body.tweet,
  });

  try {
    const result = await newPost.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//getMethod
router.get("/getAllTweet", async (req, res) => {
  try {
    const result = await newPost.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getTweet/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Model.findById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Edit a post
router.patch("/editTweet/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const options = { new: true };
    const result = await Model.findByIdAndUpdate(id, newData, options);
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete
router.delete("/deleteTweet/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Model.findByIdAndDelete(id);
    res.send(`Delete Post with title ${result.title}`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//////////////////////////////////////////////////////////////////////////////////////

const registerSchema = joi.object({
  username: joi.string().required(),
  age: joi.number().required(),
  email: joi.string().required().email(),
  password: joi.string().min(8).required(),
});

//Register User
 
router.post("/registerUser", async (req, res) => {
  const emailExists = await Model2.findOne({ email: req.nody.email });
  if (emailExists) {
    res.status(400).send("Email already exists");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new Model2({
    username: req.body.username,
    age: req.body.age,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const { error } = await resisterSchema.validateAsync(req.body);

    if (error) {
      res.send(error);
    } else {
      const result = await user.save();
    }
    //const result = await user.save();
    res.status(200).send("User successfully registered");
  } catch (error) {
    res.status(400).send(error);
  }
});

const loginSchema = joi.object({
  email: joi.string().required().email(),
  password: joi.string().required(8),
});

//Login User
router.post("/login", async (req, res) => {
  try {
    const { error } = await loginSchema.validateAsync(req.body);
  } catch (error) {
    res.status(400).send(error);
  }

  const user = await Model2.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).send("Incorrect Email Id");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (validPassword) {
    // res.status(200).send("Login successful");

    const token = jwt.sign({ _id: user._id }, process.env.Token_Secret);
    res.header("auth-token", token).send(token);
  } else {
    res.status(400).send("Incorrect password");
  }
});

router.get("/getAllPosts", verify, (req, res) => {
  res.status(200).send("All Posts Data");
});

module.exports = router;
