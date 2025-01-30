const businessCategoryService = require("../services/businessCategoryService");

const addBusinessCategory = async (req, res) => {
  try {
    const name = req.body.name; // Extract data from the request body
    console.log("body", req.body.name);
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newCategory = await businessCategoryService.addBusinessCategory({
      name: name,
    });
    res.status(201).json({
      message: "Business category added successfully",
      data: newCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error adding business category: ${error.message}` });
  }
};

const getBusinessCategories = async (req, res) => {
  try {
    const categories = await businessCategoryService.getAll();
    res.status(200).json({
      message: "Business categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error fetching business categories: ${error.message}`,
    });
  }
};

module.exports = { addBusinessCategory, getBusinessCategories };
