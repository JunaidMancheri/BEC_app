const { Router } = require("express");
const { createCategoryController } = require("../category");
const { catchAsync } = require("../common/catchAsync.utils");

const router = Router();

router.post('/', catchAsync(createCategoryController));

exports.categoryRoutes = router;