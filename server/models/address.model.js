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
        default:null,
        required: true
    },
    locality: {
        type:  String,
        required: true
    },
    address: {
        type: String,
        default: ""
    },
    area : {
        type: String,
        default: false
    },  
    city : {
        type: String,
        default: "Active"
    },
    userId : [{
        type: mongoose.Schema.ObjectId,
        def: ""
    }]

},
    {timestamps: true}
)

const AddressModel = mongoose.model("Address", addressSchema);

export default AddressModel