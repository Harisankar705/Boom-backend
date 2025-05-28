import express, { Router } from "express";
import { GiftService } from "../services/giftService";
import { GiftController } from "../controller/giftController";
import { AuthRepository } from "../repositories/authRepository";
import { GiftRepository } from "../repositories/giftRepository";
import protect from "../middleware/protectedRoute";

const giftRouter: Router = express.Router();
const authRepository = new AuthRepository();
const giftRepository=new GiftRepository()
const giftService = new GiftService(giftRepository, authRepository);
const giftController = new GiftController(giftService);

giftRouter.post("/send", protect(),  giftController.sendGift.bind(giftController));
giftRouter.get("/sent", protect(), giftController.getSentGifts.bind(giftController));
giftRouter.get("/received", protect(), giftController.getReceivedGifts.bind(giftController));

export default giftRouter;
