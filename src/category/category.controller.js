const { categoryDtoValidator } = require("./validators")

/**
 * @type {import("../..").ExpressController}
 */
exports.createCategoryController = async (req, res, next) => {
  const data =categoryDtoValidator.verify(req.body);
  res.json({data});
}