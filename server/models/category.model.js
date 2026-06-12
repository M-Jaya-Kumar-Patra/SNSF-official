import mongoose from "mongoose";


const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String,
    }],
    parentCatName: {
        type: String
    },
    parentId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    }   

},
    {timestamps: true}  
)

categorySchema.index({ parentId: 1, name: 1 });
categorySchema.index({ name: 1 });
categorySchema.index({ createdAt: -1 });

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel
