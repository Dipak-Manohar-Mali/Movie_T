import express from "express";
import { loginController, registerController } from "../controllers/authController.js";

const router = express.Router();


// for register
router.post("/api/register",registerController)


//for login

router.post("/api/login",loginController)



export default router;