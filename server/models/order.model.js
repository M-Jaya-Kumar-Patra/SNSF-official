    import mongoose from "mongoose";

    const orderSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        orderId: {
        type: String,
        required: [true, "Order ID is required"],
        unique: true
    },
        products:[
            {
                productId: {
            type: String,
        },
        productTitle: {
            type: String
        },
        productBrand:{
            type: String,
        },
        quantity: {
            type: Number,
        },
        price:{
            type: Number
        }, 
        image: {
            type: String
        },
        subTotal: {
            type: Number
        }
                
            }
        ],
        paymentId: {
            type: String, 
            default: ""
        },
        payment_status: {
            type: String,
            default: ""
        },
        order_Status: {
            type: String,
            default: "Pending"
        },
        delivery_address: {
            type: mongoose.Schema.ObjectId,
            ref: 'address'
        },
        totalAmt:{
            type: Number,
            default: 0
        }, 
        invoiceUrl: {
  type: String,
  default: "",
},
payment_method:{
    type: String,
        
}
        

    }, { timestamps: true });

    const OrderModel = mongoose.model("Order", orderSchema);

    export default OrderModel;





    // 

    // import mongoose from "mongoose";

    // const orderSchema = new mongoose.Schema({
    //     userId: {
    //         type: mongoose.Schema.ObjectId,
    //         ref: "User"
    //     },
    //     orderId: {
    //         type: String,
    //         required: [true, "Provide orderId"],
    //         unique: true
    //     },
    //     productId: {
    //         type: mongoose.Schema.ObjectId,
    //         ref: "Product"
    //     },
    //     product_details: {
    //         type: String,
    //         image: [String] // Assuming URLs or base64 strings
    //     },
    //     productThumbnails: {
    //         type: [String], // Array of thumbnail image URLs
    //         default: []
    //     },
    //     paymentId: {
    //         type: String,
    //         default: ""
    //     },
    //     payment_status: {
    //         type: String,
    //         default: ""
    //     },
    //     delivery_address: {
    //         type: mongoose.Schema.ObjectId,
    //         ref: 'address'
    //     },
    //     totalAmt: {
    //         type: Number,
    //         default: 0
    //     },
    //     invoice_receipt: {
    //         type: String,
    //         default: ""
    //     },
    //     orderDate: {
    //         type: Date,
    //         default: Date.now
    //     },
    //     orderStatus: {
    //         type: String,
    //         enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    //         default: "Pending"
    //     }, 
    //     deliveryDate: {
    //         type: Date,
    //         default: ""
    //     },
    //     quantity: {
    //         type: Number,
    //         required: true,
    //     },
        
    // }, { timestamps: true });

    // const OrderModel = mongoose.model("Order", orderSchema);

    // export default OrderModel;

