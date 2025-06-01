import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide Name"]
    },
    email: {
        type: String,
        required: [true, "Provide email"],
        unique: True
    },
    phone: {
        type: Number,
        default: null
    },
    orders: {
        type: Number,
        default:null,
        required: true
    },
    ttlSpend:{
        type: Number,
        default: null,
        required: true
    },
    joinOn: {
        type: Date,
        default: null,
        required: true
    },
    shopping_cart: [{
        type: mongoose.Schema.ObjectId,
        ref: "cartProduct"
    }],
    orderHistory:[{
        type: mongoose.Schema.ObjectId,
        ref: "order"
    }]
},
    {timestamps: true}
)

const CustomerModel = mongoose.model("Customer", customerSchema);

export default CustomerModel