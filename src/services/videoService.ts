import mongoose, { Types } from "mongoose";
import { IVideo, IVideoRepository, IVideoService } from "../interface/interface";

export class VideoService implements IVideoService{
    private videoRepository:IVideoRepository
    constructor(videoRepository:IVideoRepository){this.videoRepository=videoRepository}
    async createVideo(videoData:IVideo){
        return await this.videoRepository.create(videoData)
    }
    async getAllVideo(page:number,limit:number)
    {
        return await this.videoRepository.findAllPaginatedPage(page,limit)
    }
    async getVideoById(id:string)
    {
        return await this.videoRepository.findById(id)
    }
    async createComment(videoId:Types.ObjectId,comment:string,userId:Types.ObjectId)
    {
        return await this.videoRepository.createComment(videoId,comment,userId)
    }
     async getComments(videoId:Types.ObjectId)
        {
            return await this.videoRepository.getComments(videoId)
        }
     async getUserBalance(userId:string)
        {
            return await this.videoRepository.getWalletBalance(userId)
        }
    
     async purchaseVideo(userId: string, videoId: string) {

    try {
      const newBalance = await this.videoRepository.purchaseVideo(userId, videoId);
      return newBalance;
    } catch (error) {
      throw error;
    }
  }   

}