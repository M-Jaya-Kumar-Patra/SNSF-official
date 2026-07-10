import PosterModel from "../models/poster.model.js";
import { createMediaCrudController } from "../services/mediaCrud.service.js";

const posterController = createMediaCrudController({
  Model: PosterModel,
  createMessage: "Poster created",
  deleteMessage: "Poster deleted",
  notFoundMessage: "Poster not found",
  reorderBodyKey: "posters",
  reorderMissingMessage: "Provide posters array with id and index",
});

export const uploadImages = posterController.uploadImages;
export const createPoster = posterController.createItem;
export const getPosters = posterController.getItems;
export const deletePoster = posterController.deleteItem;
export const removeImage = posterController.removeImage;
export const updatePoster = posterController.updateItem;
export const reorderPoster = posterController.reorderItems;
