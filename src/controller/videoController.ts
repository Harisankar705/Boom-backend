import { Response, Request } from "express";
import { IVideo, IVideoService } from "../interface/interface";
import { cloudinary } from "../config/cloudinary";
import { Types } from "mongoose";
interface IVideoController {
  upload(req: Request, res: Response): Promise<void>;
  getFeed(req: Request, res: Response): Promise<void>;
}
export class VideoController implements IVideoController {
  private videoService: IVideoService;
  constructor(videoService: IVideoService) {
    this.videoService = videoService;
  }
  async upload(req: Request, res: Response) {
    try {
      const { title, description, type, videoUrl, price } = req.body;
      console.log(req.body);
      if (!title || !description || !type) {
        throw new Error("Fields are missing!");
      }
      if (!req.user || !req.user._id) {
        res.status(401).json({ message: "Unauthorized!" });
        return;
      }
      let fileUrl = "";
      if (type === "short" && req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "video",
          folder: "boom_videos/shorts",
        });
        fileUrl = result.secure_url;
      }
      const video = await this.videoService.createVideo({
        creator: req.user._id,
        title,
        description,
        type,
        videoUrl: type === "long" ? videoUrl : "",
        fileUrl,
        price: type === "long" ? Number(price) : 0,
        createdAt: new Date(),
      });
      res.status(201).json(video);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to fetch feeds!" });
    }
  }
  async getFeed(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 10;
      if (!page || !limit) {
        throw new Error("Required fields missing");
      }
      const videos = await this.videoService.getAllVideo(page, limit);
      res.status(200).json(videos);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to fetch feeds!" });
    }
  }
  async getVideosById(req: Request, res: Response) {
    try {
      const videoId = req.params.id;
      if (!videoId) {
        throw new Error("Required fields missing");
      }
      const videos = await this.videoService.getVideoById(videoId);
      res.status(200).json({ videos });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to fetch feeds!" });
    }
  }
  async createComment(req: Request, res: Response) {
    try {
      const userId: Types.ObjectId = req.user?._id as Types.ObjectId;
      if (!userId) throw new Error("User id required!");
      const { videoId, comment } = req.body;
      console.log(videoId, comment);
      if (!comment || !videoId) {
        throw new Error("Required fields are missing!");
      }
      const objectVideoId = new Types.ObjectId(videoId);
      const data = await this.videoService.createComment(
        objectVideoId,
        comment,
        userId
      );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to fetch feeds!" });
    }
  }
  async getComments(req: Request, res: Response) {
    const videoId = req.params.id;
    if (!videoId) {
      throw new Error("Video id required!");
    }
    const objectVideoId = new Types.ObjectId(videoId);
    const data = await this.videoService.getComments(objectVideoId);
    res.status(200).json(data);
  }
  async getWalletBalance(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const balance = await this.videoService.getUserBalance(userId);
       res.json({ balance });
       return
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to fetch balance" });
    }
  }
  async purchaseVideo(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      const { videoId } = req.body;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      if (!videoId) {
        res.status(400).json({ message: "Missing videoId" });
        return;
      }
      const newBalance = await this.videoService.purchaseVideo(userId, videoId);
      res.status(200).json({ success: true, newBalance });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message || "Purchase failed" });
    }
  }
}
