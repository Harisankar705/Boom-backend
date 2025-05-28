import { Request, Response } from "express";
import { IGiftService } from "../interface/interface";
import { Types } from "mongoose";

export class GiftController {
  constructor(private giftService: IGiftService) {}
   
  async sendGift(req: Request, res: Response) {
    try {
      console.log('in send gift',req.body)
    const senderId: Types.ObjectId = req.user?._id as Types.ObjectId; 
      if (!senderId) { 
        res.status(401).json({ message: "Unauthorized"})
            return
    }
      
      const { creatorId, videoId, amount } = req.body;
      if (!creatorId || !videoId || !amount) {
         res.status(400).json({ message: "Missing fields" });
         return
      }
    if(senderId.toString()===creatorId.toString())
      {
         throw new Error("You cannot gift your own video");
      }
      const gift = await this.giftService.sendGift(senderId.toString(), creatorId, videoId, Number(amount));
      res.status(200).json({ success: true, gift });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: err.message || "Failed to send gift" });
    }
  }

  async getSentGifts(req: Request, res: Response) {
    try {
    const userId: Types.ObjectId = req.user?._id as Types.ObjectId; 
         if (!userId)  {
            res.status(401).json({ message: "Unauthorized" });
            return
         }
         

      const gifts = await this.giftService.getSentGifts(userId.toString());
      res.status(200).json(gifts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch gifts" });
    }
  }

  async getReceivedGifts(req: Request, res: Response) {
    try {
    const userId: Types.ObjectId = req.user?._id as Types.ObjectId; 
      if (!userId) { res.status(401).json({ message: "Unauthorized" })
        return    
    }

      const gifts = await this.giftService.getReceivedGifts(userId.toString());
      res.status(200).json(gifts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch gifts" });
    }
  }
}
