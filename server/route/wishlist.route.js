import { Router } from "express";
import auth from "../middlewares/auth.js";
import {addToWishlist, getWishlistItemController, deleteWishlistItemContoller, getMostWishlisted}from '../controllers/wishlist.controller.js'

const wishRouter = Router()

wishRouter.post('/add',auth, addToWishlist);
wishRouter.get('/get',auth, getWishlistItemController);
wishRouter.delete('/delete-wishlist-item',auth, deleteWishlistItemContoller);
wishRouter.get("/analytics/most-wishlisted", getMostWishlisted);


export default wishRouter          