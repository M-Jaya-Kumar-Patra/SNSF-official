import StyleYourSpaceModel from "../models/styleYourSpace.model.js";
import { createMediaCrudController } from "../services/mediaCrud.service.js";

const styleYourSpaceController = createMediaCrudController({
  Model: StyleYourSpaceModel,
  createMessage: "Style Your Space item created",
  deleteMessage: "Item deleted",
  notFoundMessage: "Item not found",
  reorderBodyKey: "items",
  reorderMissingMessage: "Provide items array with id and index",
});

export const uploadImages = styleYourSpaceController.uploadImages;
export const createSpace = styleYourSpaceController.createItem;
export const getSpaces = styleYourSpaceController.getItems;
export const deleteSpace = styleYourSpaceController.deleteItem;
export const removeImage = styleYourSpaceController.removeImage;
export const updateSpace = styleYourSpaceController.updateItem;
export const reorderSpaces = styleYourSpaceController.reorderItems;
