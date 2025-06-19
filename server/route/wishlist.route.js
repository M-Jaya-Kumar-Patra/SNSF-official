import { Router } from "express";
import auth from "../middlewares/auth.js";
import {addToWishlist, getWishlistItemController, deleteWishlistItemContoller}from '../controllers/wishlist.controller.js'

const wishRouter = Router()

wishRouter.post('/add',auth, addToWishlist)
wishRouter.get('/get',auth, getWishlistItemController)
wishRouter.delete('/delete-wishlist-item',auth, deleteWishlistItemContoller)


export default wishRouter          