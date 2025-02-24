const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");

router.post("/new_hotel", hotelController.addHotel);
router.delete("/delete_hotel/:hotelId", hotelController.deleteHotel);
module.exports = router;
