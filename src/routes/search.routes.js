const { Router } = require("express");
const { catchAsync } = require("../common/catchAsync.utils");
const { searchPosts } = require("../search");

const router = Router();

router.get('/', catchAsync(searchPosts));

exports.searchRoutes = router;