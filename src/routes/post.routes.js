const {Router} = require('express');
const {catchAsync} = require('../common/utils');
const {
  createPost,
  getAllPosts,
  getPostsOfACategory,
  getSinglePost,
  updatePostDetails,
  addPostGalleryImages,
  deleteGalleryImage,
  addBrochure,
  deleteBrochure,
  updateCoverImage,
  toggleStatus,
  deletePost,
  getCoursesOfAPost,
  getPostsProvidingACourse,
} = require('../post/post.controller');
const {uploadTemporary} = require('../common/upload.helper');
const {validateInputs} = require('../common/validators.utils');
const {createPostValidator, updatePostValidator} = require('../post');
const {adminRouteGuard, populateUserDetails} = require('../auth');

const router = Router();

router.post(
  '/',
  adminRouteGuard,
  uploadTemporary.fields([
    {
      name: 'brochureFile',
      maxCount: 1,
    },
    {name: 'coverImage', maxCount: 1},
    {name: 'gallery', maxCount: 4},
  ]),
  validateInputs(createPostValidator),
  catchAsync(createPost)
);

router.get('/', adminRouteGuard, catchAsync(getAllPosts));
router.get(
  '/category/:categoryId',
  populateUserDetails,
  catchAsync(getPostsOfACategory)
);
router.get('/:postId/courses', catchAsync(getCoursesOfAPost));
router.get('/:postId', populateUserDetails, catchAsync(getSinglePost));

router.get('/course/:courseId', catchAsync(getPostsProvidingACourse));

router.put(
  '/:postId/details',
  adminRouteGuard,
  validateInputs(updatePostValidator),
  catchAsync(updatePostDetails)
);
router.post(
  '/:postId/gallery',
  adminRouteGuard,
  uploadTemporary.array('gallery'),
  catchAsync(addPostGalleryImages)
);
router.delete(
  '/:postId/gallery/:index',
  adminRouteGuard,
  catchAsync(deleteGalleryImage)
);

router.post(
  '/:postId/brochure',
  adminRouteGuard,
  uploadTemporary.single('brochureFile'),
  catchAsync(addBrochure)
);

router.delete('/:postId/brochure', adminRouteGuard, catchAsync(deleteBrochure));

router.put(
  '/:postId/coverImage',
  adminRouteGuard,
  uploadTemporary.single('coverImage'),
  catchAsync(updateCoverImage)
);

router.patch(
  '/:postId/toggle-status',
  adminRouteGuard,
  catchAsync(toggleStatus)
);

router.delete('/:postId', adminRouteGuard, catchAsync(deletePost));
exports.postRoutes = router;
