const BusinessCategory = require("../models/businessCategory");

const businessCategoryService = {
  addBusinessCategory: async (categoryData) => {
    try {
      const category = new BusinessCategory(categoryData);
      return await category.save();
    } catch (error) {
      throw new Error(`Failed to add business category: ${error.message}`);
    }
  },

  getAll: async () => {
    try {
      return await BusinessCategory.find();
    } catch (error) {
      throw new Error(`Failed to fetch business categories: ${error.message}`);
    }
  },
};

module.exports = businessCategoryService;
