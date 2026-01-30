import express from 'express';
import { Getallprofile, GetProfile, Login, Logout, Register } from '../controllers/user.controoller.js';
import { IsAuth } from '../middlewares/Auth.js';
import { body } from 'express-validator';


const router = express.Router();

router.post("/register",  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 characters long"),
  ], Register);
router.post("/login",[
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 characters long"),
  ],Login);

  router.get("/Getallusers",IsAuth,Getallprofile);
  router.get("/profile",IsAuth,GetProfile);
  router.get("/logout",IsAuth,Logout);
export default router;