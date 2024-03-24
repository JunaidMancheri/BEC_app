const { Router } = require("express");
const { categoryRoutes } = require("./category.routes");
const { amenityRoutes } = require("./amenity.routes");

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/amenities', amenityRoutes)


exports.routes = router;