import { Types } from "mongoose";
import { IVideo, IVideoRepository } from "../interface/interface";
import Comment from "../models/Comment";
import Video from "../models/Video";
import User from "../models/User";
export class VideoRepository implements IVideoRepository {
  private videoModel: typeof Video;
  private commentModel: typeof Comment;
  private userModel: typeof User;
  constructor(
    videoModel: typeof Video = Video,
    commentModel: typeof Comment = Comment,
    userModel: typeof User
  ) {
    (this.videoModel = videoModel),
      (this.commentModel = commentModel),
      (this.userModel = userModel);
  }
  async create(videoData: Partial<IVideo>) {
    return await this.videoModel.create(videoData);
  }
  async createComment(
    videoId: Types.ObjectId,
    comment: string,
    userId: Types.ObjectId
  ) {
    return await this.commentModel.create({
      video: videoId,
      text: comment,
      user: userId,
      createdAt: new Date(),
    });
  }
  async findAllPaginatedPage(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await this.videoModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("creator", "username");
  }
  async findById(id: string) {
    return await this.videoModel.findById(id).populate("creator", "username");
  }
  async getComments(videoId: Types.ObjectId) {
    return await this.commentModel
      .find({ video: videoId })
      .sort({ createdAt: -1 })
      .populate("user", "username");
  }
  async getWalletBalance(userId:string)
  {
    const user=await this.userModel.findById(userId).select('wallet');
    return  user?.wallet
  }
  async purchaseVideo(userId: string, videoId: string): Promise<number> {
    const user = await User.findById(userId);
    const video = await Video.findById(videoId);
    const creator=await User.findById(video?.creator)
    if (!user || !video) {
      throw new Error("User or Video not found");
    }
    if(!creator)
    {
      throw new Error("User required!")
    }
    if (video.creator.toString() === userId.toString()) {
      throw new Error("You cannot purchase your own video");
    }
    const alreadyPurchased = user.purchases.some(
      (vId) => vId.toString() === video._id.toString()
    );
    if (alreadyPurchased) {
      throw new Error("You already purchased this video");
    }
    if (user.wallet < video.price) {
      throw new Error("Insufficient balance");
    }
    user.wallet -= video.price;
    user.purchases.push(video._id);
    creator.wallet+=video.price
    console.log("About to save user after purchase...");
    await Promise.all([user.save(),creator.save()])
    console.log("User saved successfully, new wallet:", user.wallet);
    return user.wallet;
  }
}
