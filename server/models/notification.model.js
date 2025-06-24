import mongoose from "mongoose";
import { type } from "os";


const notificationSchema = mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    message: {
        type: String
    },
    image: {
        type: String,
    },
    link: {
        type: String
    },
    read: {
        type: Boolean,
        default:false
    },

},
    { timestamps: true }
)

const NotificationModel = mongoose.model("Notification", notificationSchema);

export default NotificationModel