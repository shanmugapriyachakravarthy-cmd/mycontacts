const asyncHandler = require("express-async-handler"); // we dont need seperate try catch block, simply wrap the function with async handler
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwttoken = require("jsonwebtoken");
//@desc Post Register user
//@route POST api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log("req.body", req.body);
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All feilds are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("password Hashed", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log("user", `${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  //we cant store raw password directly into the database. So we are using another library to hash(hashing the password).
  //res.json({ message: "Register new User" });
});

//@desc Post Register user
//@route POST api/users/register
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ email });
  //compare password with hashedPassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwttoken.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(400);
    throw new Error("The user email or Password is invalid");
  }
});

//@desc GET Current  user
//@route GET api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
