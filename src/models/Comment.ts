import mongoose from "mongoose";
import { IComment } from "../interface/interface";

const commentSchema=new mongoose.Schema<IComment>({
    video:{type:mongoose.Schema.Types.ObjectId,ref:'Video'},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    text:{type:String,required:true},
    createdAt:{type:Date,required:true}
})
const Comment=mongoose.model<IComment>("Comment",commentSchema)
export default Comment