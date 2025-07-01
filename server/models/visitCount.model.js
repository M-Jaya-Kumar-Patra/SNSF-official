// models/visitCount.model.js

import mongoose from "mongoose";

const visitCountSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
});

const VisitCountModel = mongoose.models.VisitCount || mongoose.model("VisitCount", visitCountSchema);

export default VisitCountModel;
