import mongoose from "mongoose";
import { IAuthRepository, IUser } from "../interface/interface";
import User from "../models/User";

export class AuthRepository implements IAuthRepository{
    private userModel:typeof User
    constructor(userModel:typeof User=User){this.userModel=userModel}
    async createUser(data:Partial<IUser>):Promise<IUser>{
        return await this.userModel.create(data)
    }
    async findByEmail(email:string):Promise<IUser|null>{
    return await this.userModel.findOne({ email }).select("+password").exec();
    }
    async getUserById(id:string):Promise<IUser|null>{
        return await this.userModel.findById(id).exec()
    }
    async updateUser(id: string, updateData: Partial<IUser>, session?: mongoose.ClientSession)
{
        return await this.userModel.findByIdAndUpdate(id,updateData,{new:true})
    }
}