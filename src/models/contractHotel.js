const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    minimumNight: {
      type: Number,
      required: true,
    },
    allotment: {
      type: Number,
      required: true,
    },
    cancelationDelay: {
      type: Number,
      required: true,
    },
    retrocessionDelay: {
      type: Number,
      required: true,
    },
    weekPrice: {
      type: Number,
      required: true,
    },
    weekendPrice: {
      type: Number,
      required: true,
    },
    supplementSingleWeekend: {
      type: Number,
      required: true,
    },
    supplementSingle: {
      type: Number,
      required: true,
    },
    roomsType: [
      {
        roomType: { type: String, required: false },
        numberOfRooms: { type: Number, required: false },
        price: { type: Number, required: false },
      },
    ],
    arrangement: [
      {
        arrangement: { type: String, required: false },
        price: { type: Number, required: false },
      },
    ],
    supplements: [
      {
        supplement: { type: String, required: false },
        price: { type: Number, required: false },
      },
    ],
    options: [
      {
        option: { type: String, required: false },
        price: { type: Number, required: false },
      },
    ],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contract", contractSchema);
