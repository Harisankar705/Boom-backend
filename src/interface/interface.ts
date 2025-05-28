import { Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import mongoose, { ClientSession, Document, HydratedDocument, Types } from "mongoose";

export interface IUser extends Document{
    _id:Types.ObjectId,
    username:string,
    email:string,
    password:string,
    googleId?:string,
    wallet:number,
    purchases:mongoose.Types.ObjectId[]
}
export interface IVideo{
    creator:mongoose.Types.ObjectId,
    title:string,
    description:string,
    type:string,
    fileUrl:string,
    videoUrl:string,
    price:number,
    createdAt:Date
}
export interface IComment{
    video:mongoose.Types.ObjectId,
    user:mongoose.Types.ObjectId,
    text:string,
    createdAt:Date
}
export interface IGift{
    video:mongoose.Types.ObjectId,
    fromUser:mongoose.Types.ObjectId,
    toCreator:mongoose.Types.ObjectId,
    text:string,
    amount:number,
    createdAt:Date,
}
export interface IAuthRepository {
  createUser(data: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  getUserById(id: string): Promise<IUser | null>;
  updateUser(id: string, updateData: Partial<IUser>, session?: mongoose.ClientSession): Promise<IUser | null>;
}

export interface IAuthService{
    register(data: Partial<IUser>): Promise<{ user: IUser, token: string }>
    login(email:string,password:string):Promise<{user:IUser;token:string}>
    verifyGoogleToken(token:string):Promise<TokenPayload|undefined>
    authenticateGoogleUser(token:string):Promise<{user:IUser,token:string}>
}
export interface IAuthController{
    register(req:Request,res:Response):Promise<void>
    googleLogin(req:Request,res:Response):Promise<void>
    login(req:Request,res:Response):Promise<void>
}
export interface IVideoRepository {
    create(videoData:Partial<IVideo>):Promise<IVideo>
    findAllPaginatedPage(page:number,limit:number):Promise<IVideo[]>
    findById(id:string):Promise<IVideo|null>
    createComment(videoId:Types.ObjectId,comment:string,userId:Types.ObjectId):Promise<IComment|null>
    getComments(videoId:Types.ObjectId):Promise<Partial<IComment[]>>
    purchaseVideo(userId: string,videoId: string):Promise<number>
    getWalletBalance(userId:string):Promise<number|undefined>
}
export interface IVideoService{
    createVideo(videoData:IVideo):Promise<IVideo>
    getAllVideo(page:number,limit:number):Promise<IVideo[]>
    getVideoById(id:string):Promise<IVideo|null>
    createComment(videoId:Types.ObjectId,comment:string,userId:Types.ObjectId):Promise<IComment|null>
    getComments(videoId:Types.ObjectId):Promise<Partial<IComment[]>>
    purchaseVideo(userId: string,videoId: string):Promise<number>
    getUserBalance(userId:string):Promise<number|undefined>
}
export interface IGiftRepository{
    createGift(data: IGift, session?: mongoose.ClientSession):Promise<IGift>
    getGiftsSentByUser(userId: string):Promise<IGift[]>
    getGiftsReceivedByUser(userId: string):Promise<IGift[]>

}
export interface IGiftService {
    sendGift(senderId: string,creatorId: string,videoId: string,amount: number): Promise<IGift>;
    getSentGifts(userId: string): Promise<IGift[]>;
    getReceivedGifts(userId: string): Promise<IGift[]>;
}

export interface IGiftController
{
    createGift(req:Request,res:Response):Promise<void>
}


export interface AuthenticatedRequest extends Request {
  user?: HydratedDocument<IUser>;
}