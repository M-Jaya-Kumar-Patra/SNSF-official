import HomeSectionItem from "../models/homeSectionItem.model.js";
import ProductModel from "../models/product.model.js";

// Create
export const createHomeSectionItem = async (req, res) => {
  try {
    const payload = req.body;

    // Prevent duplicate: same productId + sectionName
    const exists = await HomeSectionItem.findOne({
      productId: payload.productId,
      sectionName: payload.sectionName
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "This product already exists in this section."
      });
    }

    const item = await HomeSectionItem.create(payload);
    return res.status(201).json({ success: true, data: item });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update
export const updateHomeSectionItem = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const item = await HomeSectionItem.findByIdAndUpdate(id, payload, {
      new: true
    });

    return res.status(200).json({ success: true, data: item });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Delete
export const deleteHomeSectionItem = async (req, res) => {
  try {
    const { id } = req.params;
    await HomeSectionItem.findByIdAndDelete(id);

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get Items
export const getHomeSectionItems = async (req, res) => {
  try {
    const { sectionName } = req.query;

    
    const filter = {};
    if (sectionName) filter.sectionName = sectionName;
    
    const items = await HomeSectionItem.find(filter)
    .sort({ index: 1, pinned: -1, dateCreated: -1 })
    .lean();
    
    // Collect product IDs from items
    const productIds = items.map(i => i.productId).filter(Boolean);

    let productsById = {};
    if (productIds.length > 0) {
      const products = await ProductModel.find({
        _id: { $in: productIds }
      }).select("name images price brand slug");

      products.forEach(p => {
        productsById[p._id.toString()] = p;
      });
    }

    // DO NOT overwrite item._id
    const mergedItems = items.map(item => ({
      ...item,
      product: productsById[item.productId?.toString()] || null
    }));


    return res.status(200).json({ success: true, data: mergedItems });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Reorder
export const reorderHomeSectionItems = async (req, res) => {
  try {
    const { orderedIds, items } = req.body;

    console.log("orderedIds, items , ", orderedIds, items )

    if ((!orderedIds || !Array.isArray(orderedIds)) &&
        (!items || !Array.isArray(items))) {
      return res.status(400).json({
        success: false,
        message: "Provide orderedIds[] or items[]."
      });
    }

    const ops = [];

    if (orderedIds?.length) {
      orderedIds.forEach((id, index) => {
        ops.push({
          updateOne: {
            filter: { _id: id },
            update: { $set: { index } }
          }
        });
      });
    } else {
      items.forEach(it => {
        if (!it.id) return;
        const data = {};
        if (it.index !== undefined) data.index = it.index;
        if (it.pinned !== undefined) data.pinned = it.pinned;
        if (Object.keys(data).length === 0) return;

        ops.push({
          updateOne: {
            filter: { _id: it.id },
            update: { $set: data }
          }
        });
      });
    }

    await HomeSectionItem.bulkWrite(ops);

    const updatedItems = await HomeSectionItem.find({})
      .sort({ index: 1, pinned: -1, dateCreated: -1 })
      .lean();

    return res.status(200).json({ success: true, data: updatedItems });

  } catch (err) {
    console.error("reorderHomeSectionItems error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Search
export const searchProducts = async (req, res) => {
  try {
    const q = req.query.q || "";

    const filter = {};
    if (q.trim()) {
      const like = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { name: like },
        { brand: like },
        { slug: like }
      ];
    }

    const results = await ProductModel.find(filter)
      .limit(20)
      .select("name images price brand slug");

    return res.status(200).json({
      success: true,
      data: results
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
