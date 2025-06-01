import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createProduct, getAllProducts, uploadImages, getAllProductsByCatId, getAllProductsByCatName, getAllProductsBySubCatId, getAllProductsBySubCatName, getAllProductsByThirdCatId, getAllProductsByThirdCatName, getAllProductsByPrice, getAllProductsByRating, getProductsCount, getAllFeaturedProducts, deleteProduct,
getProduct, removeImageFromCloudinary, updateProduct

} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post('/uploadImages', auth, upload.array('images'), uploadImages)
productRouter.post('/create', auth,  createProduct)
productRouter.get('/gaps', getAllProducts)
productRouter.get('/gapsByCatId', getAllProductsByCatId)
productRouter.get('/gapsByC atName', getAllProductsByCatName)
productRouter.get('/gapsBySubCatId', getAllProductsBySubCatId)
productRouter.get('/gapsBySubCatName', getAllProductsBySubCatName)
productRouter.get('/gapsByThirdCatId', getAllProductsByThirdCatId)
productRouter.get('/gapsByThirdCatName', getAllProductsByThirdCatName)
productRouter.get('/gapsByPrice', getAllProductsByPrice)
productRouter.get('/gapsByRating', getAllProductsByRating)
productRouter.get('/getAllProductsCount', getProductsCount)
productRouter.get('/getAllFeaturedProducts', getAllFeaturedProducts)
productRouter.delete('/:id', deleteProduct)
productRouter.get('/:id', getProduct)
productRouter.delete("/deleteImg", auth, removeImageFromCloudinary);
productRouter.post("/updateProduct/:id", auth, updateProduct);









export default productRouter