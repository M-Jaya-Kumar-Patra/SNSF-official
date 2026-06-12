import mongoose from "mongoose";
import slugify from "slugify";


const HomeSectionItemSchema = new mongoose.Schema({
sectionName: {
type: String,
enum: [
"bestsellers",
"curatedLook",
"shopByRoom",//
"trendingNow",
"posters",//
"dealsOfTheWeek",
"newArrivals",
"recommended",
],
required: true,
},
title: { type: String, default: "" }, // optional friendly label
slug: { type: String, unique: true, sparse: true },


// link to a real product, optional for poster/banner items
productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },


// optional image/banner for posters or curated cards
image: { type: String, default: "" },


// order index within the section
index: { type: Number, default: 9999 },


// whether this item is active
enabled: { type: Boolean, default: true },


// metadata to customize rendering
metadata: { type: mongoose.Schema.Types.Mixed, default: {} },


// for admin use: whether this item is pinned to top
pinned: { type: Boolean, default: false },


dateCreated: { type: Date, default: Date.now },
});


HomeSectionItemSchema.pre("save", function (next) {
if (!this.slug && this.title) {
this.slug = slugify(this.title, { lower: true, strict: true });
}
next();
});

HomeSectionItemSchema.index({ sectionName: 1, enabled: 1, index: 1, pinned: -1 });
HomeSectionItemSchema.index({ productId: 1, sectionName: 1 });
HomeSectionItemSchema.index(
{ sectionName: 1, productId: 1 },
{
unique: true,
partialFilterExpression: { productId: { $type: "objectId" } },
}
);


const HomeSectionItem = mongoose.models.HomeSectionItem || mongoose.model("HomeSectionItem", HomeSectionItemSchema);
export default HomeSectionItem;
