import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addToCartItemController, getCartItemController, updateCartItemQtyController, deleteCartItemQtyContoller


 } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.post('/add',auth, addToCartItemController)
cartRouter.post('/get',auth, getCartItemController)
cartRouter.post('/update-qty',auth, updateCartItemQtyController)
cartRouter.delete('/delete-cart-item',auth, deleteCartItemQtyContoller)




export default cartRouter   