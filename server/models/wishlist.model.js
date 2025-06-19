import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema({
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
    price: {
        type: Number,
        required: true,
    },

},
    { timestamps: true }
)

const WishlistModel = mongoose.model("Wishlist", wishlistSchema);

export default WishlistModel