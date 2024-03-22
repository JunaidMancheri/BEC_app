const { Router } = require("express");
const { categoryRoutes } = require("./category.routes");

const router = Router();

router.use('/categories', categoryRoutes);


exports.routes = router;