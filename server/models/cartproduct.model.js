import mongoose from "mongoose";

const cartProductSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    productTitle: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    },

},
    { timestamps: true }
)

const CartProductModel = mongoose.model("CartProduct", cartProductSchema);

export default CartProductModel