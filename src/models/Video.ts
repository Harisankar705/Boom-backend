import mongoose from "mongoose";
import { IVideo } from "../interface/interface";

const videoSchema=new mongoose.Schema<IVideo>({
    creator:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    title:{type:String,required:true},
    description:{type:String,required:true},
    type:{type:String,enum:['short','long']},
    fileUrl:{type:String},
    videoUrl:{type:String},
    price:{type:Number,default:0},
    createdAt:{type:Date,default:Date.now}

})
const Video=mongoose.model<IVideo>("Video",videoSchema)
export default Video