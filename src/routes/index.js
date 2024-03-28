const { Router } = require("express");
const { categoryRoutes } = require("./category.routes");
const { amenityRoutes } = require("./amenity.routes");
const { postRoutes } = require("./post.routes");
const { bannerRoutes } = require("./banner.routes");
const { generalDetailsRoutes } = require("./general-details.routes");
const { courseRoutes } = require("./course.routes");
const { enquiryRoutes } = require("./enquiry.routes");
const { adminRoutes } = require("./admin.routes");
const { authRoutes } = require("./auth.routes");
const { searchRoutes } = require("./search.routes");

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/admins', adminRoutes);
router.use('/search', searchRoutes);
router.use('/banners', bannerRoutes);
router.use('/courses', courseRoutes);
router.use('/amenities', amenityRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/categories', categoryRoutes);
router.use('/general-details', generalDetailsRoutes);

exports.routes = router;