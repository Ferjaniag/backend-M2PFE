const Hotel = require("../models/hotel");
const User = require("../models/user");

var hotelServices = {
  addHotel: async (hotelData) => {
    try {
      // Check if the owner (user) exists
      const owner = await User.findById(hotelData.owner);
      if (!owner) {
        throw new Error("Owner not found");
      }

      const newHotel = new Hotel({
        owner: hotelData.owner,
        name: hotelData.name,
        numberstars: hotelData.numberstars,
        city: hotelData.city,
        contractType: hotelData.contractType,
        minChildAge: hotelData.minChildAge,
        maxChildAge: hotelData.maxChildAge,
        address: hotelData.address,
        tripadvisor: hotelData.tripadvisor,
        shortDescription: hotelData.shortDescription,
        longDescription: hotelData.longDescription,
        roomType: hotelData.roomType,
        childCategory: hotelData.childCategory,
        hotelOptions: hotelData.hotelOptions,
        arrangements: hotelData.arrangements,
        supplements: hotelData.supplements,
        weekendDays: hotelData.weekendDays,
        images: hotelData.images,
        addedBy: hotelData.addedBy,
      });

      const savedHotel = await newHotel.save();

      // Return the saved hotel data
      return savedHotel;
    } catch (error) {
      throw new Error(`Error adding hotel: ${error.message}`);
    }
  },

  deleteHotel: async (hotelId) => {
    try {
      const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

      if (!deletedHotel) {
        throw new Error("Hotel not found");
      }

      return deletedHotel;
    } catch (error) {
      throw new Error(`Error deleting hotel: ${error.message}`);
    }
  },
};

module.exports = hotelServices;
