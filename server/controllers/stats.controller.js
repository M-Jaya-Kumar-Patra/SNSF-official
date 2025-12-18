import UserModel from "../models/user.model.js";
import EnquiryModel from "../models/enquiry.model.js";
import ProductModel from "../models/product.model.js";
import VisitCountModel from "../models/visitCount.model.js";

export const getAdminStats = async (req, res) => {
  try {
    // Fast counts (MongoDB estimatedDocumentCount is best)
    const users = await UserModel.estimatedDocumentCount();
    const enquiries = await EnquiryModel.estimatedDocumentCount();
    const products = await ProductModel.estimatedDocumentCount();
    const visits = await VisitCountModel.estimatedDocumentCount();

    res.json({
      success: true,
      stats: {
        users,
        enquiries,
        products,
        visits,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
