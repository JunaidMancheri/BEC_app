const { Router } = require("express");
const { categoryRoutes } = require("./category.routes");
const { amenityRoutes } = require("./amenity.routes");
const { postRoutes } = require("./post.routes");

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/amenities', amenityRoutes);
router.use('/posts', postRoutes);


exports.routes = router;