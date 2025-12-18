import express from "express";
import {
createHomeSectionItem,
updateHomeSectionItem,
deleteHomeSectionItem,
getHomeSectionItems,
reorderHomeSectionItems,
searchProducts
} from "../controllers/homeSection.controller.js";


const sectionRouter = express.Router();


sectionRouter.post("/", createHomeSectionItem);//body
sectionRouter.put("/:id", updateHomeSectionItem);//param, body
sectionRouter.delete("/:id", deleteHomeSectionItem);//param
sectionRouter.get("/", getHomeSectionItems);//query
sectionRouter.post("/reorder", reorderHomeSectionItems);//body
sectionRouter.get("/search", searchProducts);//query4


export default sectionRouter;