import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    //checking if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Failed to login user" });
  }
};
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

//register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  //validating email format and strong  password
  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "please enter a valid email" });
  }
  if (password.length < 8) {
    return res.json({
      success: false,
      message: "please enter strong password  at least 8 characters long",
    });
  }
  try {
    //checking is user already exists

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });

    //creating jwt token

    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // res.status(201).json({
    //     success: true,
    //     message: "User registered successfully",
    //     token,
    //     user: {
    //         _id: newUser._id,
    //         name: newUser.name,
    //         email: newUser.email
    //     }
    // })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to register user" });
  }
};

export { loginUser, registerUser };
