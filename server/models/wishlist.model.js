import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
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
    },
    price: {
        type: Number,
    },

},
    { timestamps: true }
)

const WishlistModel = mongoose.model("Wishlist", wishlistSchema);

export default WishlistModel