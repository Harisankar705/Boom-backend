import {v2 as cloudinary} from 'cloudinary'
import { CloudinaryStorage } from "multer-storage-cloudinary";
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
const storage=new CloudinaryStorage({
    cloudinary,
    params:async(req,file)=>({
        resource_type:'video',
        folder:'boom-short-videos',
        format:'mp4',
        public_id:`${Date.now()}-${file.originalname}`

    })
})
export {cloudinary,storage}