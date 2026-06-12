import express from "express";
import {
createHomeSectionItem,
updateHomeSectionItem,
deleteHomeSectionItem,
getHomeSectionItems,
reorderHomeSectionItems,
searchProducts
} from "../controllers/homeSection.controller.js";
import {
cacheResponse,
invalidateCacheOnSuccess,
} from "../middlewares/cache.js";


const sectionRouter = express.Router();
const homeSectionCache = cacheResponse("homeSections", Number(process.env.HOME_SECTION_CACHE_TTL_SECONDS) || 180);
const invalidateHomeSectionCache = invalidateCacheOnSuccess([
"homeSections",
"products",
]);


sectionRouter.post("/", invalidateHomeSectionCache, createHomeSectionItem);//body
sectionRouter.put("/:id", invalidateHomeSectionCache, updateHomeSectionItem);//param, body
sectionRouter.delete("/:id", invalidateHomeSectionCache, deleteHomeSectionItem);//param
sectionRouter.get("/", homeSectionCache, getHomeSectionItems);//query
sectionRouter.post("/reorder", invalidateHomeSectionCache, reorderHomeSectionItems);//body
sectionRouter.get("/search", cacheResponse("productSearch", 60), searchProducts);//query4


export default sectionRouter;
