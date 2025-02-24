const hotelService = require("../services/hotelService");

const addHotel = async (req, res) => {
  try {
    const hotelData = req.body;
    const newHotel = await hotelService.addHotel(hotelData);
    res.status(201).json({
      success: true,
      message: "Hotel added successfully",
      hotel: newHotel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const deletedHotel = await hotelService.deleteHotel(hotelId);
    res.status(200).json({
      success: true,
      message: "Hotel deleted successfully",
      hotel: deletedHotel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { addHotel, deleteHotel };
