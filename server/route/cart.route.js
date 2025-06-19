import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addToCartItemController, emptyCartController, getCartItemController, updateCartItemQtyController, deleteCartItemQtyContoller

 } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.post('/add',auth, addToCartItemController)
cartRouter.get('/get',auth, getCartItemController)
cartRouter.post('/update-qty',auth, updateCartItemQtyController)
cartRouter.delete('/delete-cart-item',auth, deleteCartItemQtyContoller)
cartRouter.delete('/emptyCart/:id',auth, emptyCartController)





export default cartRouter   