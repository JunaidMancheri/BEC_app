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

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/amenities', amenityRoutes);
router.use('/posts', postRoutes);
router.use('/banners', bannerRoutes);
router.use('/general-details', generalDetailsRoutes);
router.use('/courses', courseRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/admins', adminRoutes);
router.use('/auth', authRoutes);

exports.routes = router;