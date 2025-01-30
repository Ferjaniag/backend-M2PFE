const express = require("express");
const router = express.Router();
const businessCategoryController = require("../controllers/businessCategoryController");

router.post("/add_category", businessCategoryController.addBusinessCategory);
router.get("/get_categories", businessCategoryController.getBusinessCategories);

module.exports = router;
