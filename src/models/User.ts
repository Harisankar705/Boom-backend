import mongoose from "mongoose";
import { IUser } from "../interface/interface";

const userSchema=new mongoose.Schema<IUser>({
    username:{type:String,required:function(){return !this.googleId}},
    email:{type:String,required:true},
    password:{type:String,required:function(){return !this.googleId}},
    googleId:{type:String},
    wallet:{type:Number,default:500},
    purchases:[{type:mongoose.Schema.Types.ObjectId,ref:"Video"}],

})
const User=mongoose.model<IUser>("User",userSchema)
export default User