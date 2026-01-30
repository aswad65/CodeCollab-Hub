import User from "../models/Usermodel.js";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";


export async function Register(req, res) {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!email) {
      return res.status(400).json({ message: "Please enter the email" });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await User.hashPassword(password)

    const user = await User.create({
      email: email,
      password: hashedPassword
    });
    const token = await user.generateToken()
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({ message: "Register Successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function Login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }


    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Please enter a valid password" });
    }

    const token = await user.generateToken()

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export async function GetProfile(req, res) {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    res.status(401).json({ err: error.message })
  }
}
export async function Getallprofile(req, res) {
  try {
    const loggedInUser = await User.findOne({ email: req.user.email })
    if (!loggedInUser) {
      return res.status(401).json({ err: 'User not found' })
    }


    const users = await User.find({ _id: { $ne: loggedInUser._id } })

    res.status(200).json({ users })
  } catch (error) {
    res.status(401).json({ err: error.message })
  }
}
export function Logout(req, res) {
  try {
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') {
      res.clearCookie('token');
      return res.status(200).json({ message: "Logout Successful" });
    }
    res.clearCookie('token');
    res.status(200).json({ message: "Logout Successful" })
  } catch (error) {
    console.log(error);
    res.status(401).json({ err: error.message })

  }
}
 
