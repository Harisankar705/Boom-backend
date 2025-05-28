import { Document, Types } from 'mongoose';
import { IUser } from '../interface/interface'; 

declare global {
    namespace Express {
        interface Request {
            user?: Document<unknown, {}, IUser> & IUser & Required<{ _id?: Types.ObjectId }> & { __v: number };
            file?: {
                path: string;
            };
        }
    }
}


export {};