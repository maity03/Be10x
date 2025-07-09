import express from "express";
import {
  saveFund,
  getSavedFunds,
  removeFund,
} from "../controllers/fundController.js";
import jwtMiddleware from "../middlewares/jwtMiddleware.js";

const router = express.Router();

router.post("/save", jwtMiddleware, saveFund);
router.get("/saved", jwtMiddleware, getSavedFunds);
router.delete("/remove", jwtMiddleware, removeFund);

export default router;
