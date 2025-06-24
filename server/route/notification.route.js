import { Router } from "express";
import auth from "../middlewares/auth.js";
import {sendNotification, getNotifications, markAllUnreadAsRead} from "../controllers/notification.controller.js"

import upload from "../middlewares/multer.js";

const noticeRouter = Router()


noticeRouter.post('/send',auth, sendNotification)
noticeRouter.get('/get',auth, getNotifications)
noticeRouter.put('/markUnreadRead',auth, markAllUnreadAsRead)


export default noticeRouter          