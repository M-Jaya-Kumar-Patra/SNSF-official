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

notificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

const NotificationModel = mongoose.model("Notification", notificationSchema);

export default NotificationModel
