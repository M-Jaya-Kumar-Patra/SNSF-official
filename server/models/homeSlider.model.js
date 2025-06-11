import mongoose from "mongoose";

const homeSliderSchema = new mongoose.Schema({
    images: {
        type: [String],    // Array of strings for multiple image URLs
        default: [],
        required: true     // optional: add if you want images to be mandatory
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });  // Fix option name from 'Timestamps' to 'timestamps'

const HomeSliderModel = mongoose.model("HomeSlider", homeSliderSchema);
export default HomeSliderModel;
