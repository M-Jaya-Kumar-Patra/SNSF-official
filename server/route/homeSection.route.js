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
import auth from "../middlewares/auth.js";


const sectionRouter = express.Router();
const homeSectionCache = cacheResponse("homeSections", Number(process.env.HOME_SECTION_CACHE_TTL_SECONDS) || 180);
const invalidateHomeSectionCache = invalidateCacheOnSuccess([
"homeSections",
"products",
]);


sectionRouter.get("/", homeSectionCache, getHomeSectionItems);//query
sectionRouter.post("/reorder", auth, invalidateHomeSectionCache, reorderHomeSectionItems);//body
sectionRouter.get("/search", auth, cacheResponse("productSearch", 60), searchProducts);//query4
sectionRouter.post("/", auth, invalidateHomeSectionCache, createHomeSectionItem);//body
sectionRouter.put("/:id", auth, invalidateHomeSectionCache, updateHomeSectionItem);//param, body
sectionRouter.delete("/:id", auth, invalidateHomeSectionCache, deleteHomeSectionItem);//param


export default sectionRouter;
