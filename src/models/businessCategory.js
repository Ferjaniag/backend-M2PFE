const mongoose = require("mongoose");

const businessCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const businessCategory = mongoose.model(
  "Business-Category",
  businessCategorySchema
);
module.exports = businessCategory;
