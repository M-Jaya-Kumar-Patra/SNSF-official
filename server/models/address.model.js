import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide Name"]
    },
    phone: {
        type: Number,
        default: null
    },
    pin: {
        type: Number,
        default: null,
        required: true
    },
    address: {
        type: String,
        default: ""
    },
    landmark : {
        type: String,
        default: ""
    },  
    city : {
        type: String,
        default: null
    },
    state: {
        type: String,
        default: null
    },
    altPhone: {
        type: Number,
        default: null
    },
    locality: {
        type: String,
        default: null
    },
    addressType: {
        type: String,
        default: null
    },
    userId: [{
        type: mongoose.Schema.ObjectId,
        default: null,
        ref: "User"
    }]
}, { timestamps: true });

const AddressModel = mongoose.model("address", addressSchema);
export default AddressModel;
