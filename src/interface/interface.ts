import mongoose, { Types } from "mongoose";

export interface IUser{
    _id?:Types.ObjectId,
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
export interface IAuthRepository{
    createUser(data:Partial<IUser>):Promise<IUser>
    findByEmail(email:string):Promise<IUser|null>
}
export interface IAuthService{
    register(data:Partial<IUser>):Promise<IUser>
    login(email:string,password):Promise<{user:IUser;token:string}>
    verifyGoogleToken(token:string)
    authenticateGoogleUser(token:string):Promise<{user:IUser,accessToken:string}>
}
export interface IAuthController{
    register(req:Request,res:Response):Promise<void>
    googleLogin(req:Request,res:Response)
    login(req:Request,res:Response):Promise<void>
}