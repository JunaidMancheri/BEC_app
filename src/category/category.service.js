const { categoryModel } = require("./category.model");

exports.getCategoryStatus = async (categoryId) => {
  const doc = await categoryModel.findById(categoryId, '-_id isActive');
  // return doc.isActive;
  return true;
}