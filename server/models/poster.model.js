import mongoose from "mongoose";

const posterManagerSchema = new mongoose.Schema({
    image: {
    type: [String],
    default: []
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        default: ""
    },
    index: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const PosterModel = mongoose.models.Poster || mongoose.model("Poster", posterManagerSchema);
export default PosterModel;
