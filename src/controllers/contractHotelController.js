const ContractService = require("../services/hotelContractController");

class ContractController {
  static async createContract(req, res) {
    try {
      console.log("body contract ", req.body);
      const contract = await ContractService.createContract(req.body);
      res.status(201).send({ success: true, contract: contract });
    } catch (error) {
      if (error.name === "Error") {
        res.status(400).send({
          success: false,
          message: "Error adding a period",
          errors: error.message,
        });
      } else {
        res.status(500).send({
          success: false,
          message: "Internal server error",
        });
      }
    }
  }

  static async updateContractRoomsTypeController(req, res) {
    try {
      const { contractId } = req.params;
      const { roomsType } = req.body;
    
      /*  if (!roomsType || !Array.isArray(roomsType)) {
        return res
          .status(400)
          .send({ success: false, message: "Invalid roomsType data" });
      } */

      const updatedContract = await ContractService.updateContractRoomsType(
        contractId,
        roomsType
      );
      res.status(200).send({ success: true, updatedContract: updatedContract });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  }

  static async getContractById(req, res) {
    try {
      const contract = await ContractService.getContractById(req.params.id);
      if (!contract)
        return res.status(404).json({ message: "Contract not found" });
      res.json(contract);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getContractByIdHotel(req, res) {
    try {
      const contracts = await ContractService.getContractByIdHotel(
        req.params.hotelId
      );
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update a contract
  static async updateContract(req, res) {
    try {
      const updatedContract = await ContractService.updateContract(
        req.params.id,
        req.body
      );
      if (!updatedContract)
        return res.status(404).json({ message: "Contract not found" });
      res.json(updatedContract);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a contract
  static async deleteContract(req, res) {
    try {
      const deletedContract = await ContractService.deleteContract(
        req.params.id
      );
      if (!deletedContract)
        return res.status(404).json({ message: "Contract not found" });
      res.json({ message: "Contract deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ContractController;
