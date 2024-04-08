const { Router } = require("express");
const { catchAsync } = require("../common/utils");
const { searchPosts } = require("../search");

const router = Router();

router.get('/', catchAsync(searchPosts));

exports.searchRoutes = router;