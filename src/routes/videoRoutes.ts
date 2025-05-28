import express,{ Router } from "express";
import multer from 'multer'
import protect from "../middleware/protectedRoute";
import { VideoController } from "../controller/videoController";
import { VideoService } from "../services/videoService";
import { VideoRepository } from "../repositories/videoRepository";
import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";
const upload=multer({dest:'uploads/'})
const videoRouter:Router=express.Router()
const videoRepository=new VideoRepository(Video,Comment,User)
const videoService=new VideoService(videoRepository)
const videoController=new VideoController(videoService)
videoRouter.post('/upload',protect(),upload.single('videoFile'),videoController.upload.bind(videoController))
videoRouter.get('/feed',protect(),videoController.getFeed.bind(videoController))
videoRouter.get('/:id',protect(),videoController.getVideosById.bind(videoController))
videoRouter.post('/createcomment',protect(),videoController.createComment.bind(videoController))
videoRouter.get('/comments/:id',protect(),videoController.getComments.bind(videoController))
videoRouter.post('/purchase',protect(),videoController.purchaseVideo.bind(videoController))
videoRouter.get('/balance',protect(),videoController.getWalletBalance.bind(videoController))
export default videoRouter
