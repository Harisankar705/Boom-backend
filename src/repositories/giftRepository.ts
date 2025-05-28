import { IGiftRepository } from './../interface/interface';
import Gift from "../models/Gift";
import { IGift } from "../interface/interface";
import mongoose from 'mongoose';

export class GiftRepository implements IGiftRepository {
async createGift(data: IGift, session?: mongoose.ClientSession): Promise<IGift> {
  const giftDoc = await Gift.create([data], { session });
  return giftDoc[0].toObject();  
}


  async getGiftsSentByUser(userId: string) {
    return await Gift.find({ sender: userId }).populate("recipient").sort({ createdAt: -1 });
  }

  async getGiftsReceivedByUser(userId: string) {
    return await Gift.find({ recipient: userId }).populate("sender").sort({ createdAt: -1 });
  }
}
