import mongoose, { Types } from "mongoose";
import { IAuthRepository, IGiftRepository, IGiftService } from "../interface/interface";

export class GiftService implements IGiftService {
  constructor(
    private giftRepository: IGiftRepository,
    private authRepository: IAuthRepository
  ) {}

async sendGift(senderId: string, creatorId: string, videoId: string, amount: number) {
  try {
    const sender = await this.authRepository.getUserById(senderId);
    const recipient = await this.authRepository.getUserById(creatorId);
    if(sender===recipient)
    {
       throw new Error("You cannot gift your own video");
    }

    if (!sender || !recipient) throw new Error("Sender or Recipient not found");
    if (sender.wallet < amount) throw new Error("Insufficient balance");

    sender.wallet -= amount;
    recipient.wallet += amount;

    await this.authRepository.updateUser(senderId, { wallet: sender.wallet });
    await this.authRepository.updateUser(creatorId, { wallet: recipient.wallet });

    const gift = await this.giftRepository.createGift({
      fromUser: new Types.ObjectId(senderId),
      toCreator: new Types.ObjectId(creatorId),
      video: new Types.ObjectId(videoId),
      amount,
      text: "",  
      createdAt:new Date()
    },);

    return gift;
  } catch (err) {
    throw err;
  }
}


  async getSentGifts(userId: string) {
    return await this.giftRepository.getGiftsSentByUser(userId);
  }

  async getReceivedGifts(userId: string) {
    return await this.giftRepository.getGiftsReceivedByUser(userId);
  }
}
