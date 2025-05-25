import mongoose from "mongoose";
import { IGift } from "../interface/interface";

const giftSchema=new mongoose.Schema<IGift>({
    video:{type:mongoose.Schema.Types.ObjectId,ref:"Video"},
    fromUser:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    toCreator:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    amount:{type:Number},
    createdAt:{type:Date,default:Date.now}
})
const Gift=mongoose.model<IGift>("Gift",giftSchema)
export default Gift