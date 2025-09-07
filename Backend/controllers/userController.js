import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Login user (both admin and regular users)
const loginUser = async (req, res) => {
  const { email, password, loginType } = req.body;
  try {
    // Checking if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Check if login type matches user role (if loginType is provided)
    if (loginType === "admin" && user.role !== "admin") {
      return res.json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // Update last login
    await userModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Failed to login user" });
  }
};

// Register user
const registerUser = async (req, res) => {
  const { name, password, email, role = "user" } = req.body;

  // Validating email format and strong password
  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Please enter a valid email" });
  }

  if (password.length < 8) {
    return res.json({
      success: false,
      message: "Please enter strong password at least 8 characters long",
    });
  }

  try {
    // Checking if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to register user" });
  }
};

const viewUser = (req, res) => {
  console.log("view user called");
  res.send("User viewed successfully!");
};
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching profile" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, preferences } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (preferences) updateData.preferences = preferences;

    const user = await userModel
      .findByIdAndUpdate(req.body.userId, updateData, { new: true })
      .select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating profile" });
  }
};

export { loginUser, registerUser, getUserProfile, updateUserProfile, viewUser };
