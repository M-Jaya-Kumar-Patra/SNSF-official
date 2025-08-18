import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createProduct, getAllProducts, uploadImages, getAllProductsByCatId, getAllProductsByCatName, getAllProductsBySubCatId, getAllProductsBySubCatName, getAllProductsByThirdCatId, getAllProductsByThirdCatName, getAllProductsByPrice, getAllProductsByRating, getProductsCount, getAllFeaturedProducts, deleteProduct,
getProduct, removeImageFromCloudinary, updateProduct,
deleteMultipleProducts, filters, sortBy, SearchProductsController, getProductBySlug

} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post('/uploadImages', auth, upload.array('images'), uploadImages)
productRouter.post('/create', auth,  createProduct)
productRouter.get('/gaps',  getAllProducts)



productRouter.get('/gapsByCatId/:Id', getAllProductsByCatId);
productRouter.get('/gapsByCatName', getAllProductsByCatName);
productRouter.get('/gapsBySubCatId/:Id', getAllProductsBySubCatId);
productRouter.get('/gapsBySubCatName', getAllProductsBySubCatName);
productRouter.get('/gapsByThirdCatId/:thirdSubCatId', getAllProductsByThirdCatId);
productRouter.get('/gapsByThirdCatName', getAllProductsByThirdCatName);


productRouter.get('/gapsByPrice', getAllProductsByPrice)
productRouter.get('/gapsByRating', getAllProductsByRating)
productRouter.get('/getAllProductsCount', getProductsCount)
productRouter.get('/getAllFeaturedProducts', getAllFeaturedProducts)
productRouter.delete("/deleteImg", auth, removeImageFromCloudinary);
productRouter.delete('/deleteMultiple', auth, deleteMultipleProducts)
productRouter.delete('/:id', deleteProduct)
productRouter.get('/:id', getProduct)
productRouter.post("/updateProduct/:id", auth, updateProduct);

productRouter.post("/filters", filters);
productRouter.post("/sortBy", sortBy);
productRouter.get('/search/get', SearchProductsController)


productRouter.get('/slug/:slug', getProductBySlug);











export default productRouter