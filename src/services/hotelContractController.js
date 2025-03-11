const Contract = require("../models/contractHotel");
const Hotel = require("../models/hotel");

var contractHotelService = {
  createContract: async (data) => {
    try {
      const contract = new Contract(data);
      await contract.save();

      //   await Hotel.findByIdAndUpdate(data.hotel, { status: "active" });
      return contract;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateContractRoomsType: async (contractId, newRoomsType) => {
    try {
      console.log("type of ", typeof newRoomsType);
      if (!Array.isArray(newRoomsType)) {
        throw new Error("newRoomsType must be an array");
      }
      const contract = await Contract.findById(contractId);
      if (!contract) {
        throw new Error("Contract not found");
      }

      contract.roomsType = newRoomsType;

      await contract.save();
      return contract;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getContractById: async (id) => {
    try {
      return await Contract.findById(id).populate("hotel").populate("addedBy");
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getContractByIdHotel: async (id) => {
    try {
      return await Contract.find({ hotel: id })
        .populate("hotel")
        .populate("addedBy");
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateContract: async (id, data) => {
    try {
      return await Contract.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteContract: async (id) => {
    try {
      return await Contract.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = contractHotelService;
