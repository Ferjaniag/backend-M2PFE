const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");
const contractHotelController = require("../controllers/contractHotelController");

router.post("/new_hotel", hotelController.addHotel);
router.delete("/delete_hotel/:hotelId", hotelController.deleteHotel);
router.get("/hotels/:ownerId", hotelController.getHotelsByOwnerId);
router.get("/hotel_fc/:hotelId", hotelController.getHotelByIdForContract);
router.post("/hotel_contract", contractHotelController.createContract);
router.put(
  "/hotel_contract_rooms/:contractId",
  contractHotelController.updateContractRoomsTypeController
);
module.exports = router;
