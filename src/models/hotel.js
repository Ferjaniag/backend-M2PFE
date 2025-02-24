const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["visible", "invisible", "activate", "inactivate"],
      default: "invisible",
    },
    name: {
      type: String,
      required: true,
    },
    numberstars: {
      type: Number,
      min: 1,
      max: 5,
    },
    city: {
      type: String,
      required: true,
    },
    contractType: {
      type: String,
      required: true,
    },
    minChildAge: {
      type: Number,
      required: true,
    },
    maxChildAge: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    tripadvisor: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    roomType: {
      type: [String],
      required: true,
    },
    childCategory: {
      type: [String],
      required: true,
    },
    hotelOptions: {
      type: [String],
      required: true,
    },
    arrangements: {
      type: [String],
      required: true,
    },
    supplements: {
      type: [String],
      required: true,
    },
    weekendDays: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
