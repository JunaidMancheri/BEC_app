const {Router} = require('express');
const {catchAsync} = require('../common/catchAsync.utils');
const {
  createPost,
  getAllPosts,
  getPostsOfACategory,
  getSinglePost,
  updatePostDetails,
  addPostGalleryImages,
  deleteGalleryImage,
  addBrochure,
} = require('../post/post.controller');
const {uploadTemporary} = require('../common/upload.helper');
const {validateInputs} = require('../common/validators.utils');
const {createPostValidator} = require('../post');

const router = Router();

router.post(
  '/',
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

router.get('/', catchAsync(getAllPosts));
router.get('/category/:categoryId', catchAsync(getPostsOfACategory));
router.get('/:postId', catchAsync(getSinglePost));

router.put('/:postId/details', catchAsync(updatePostDetails));
router.post('/:postId/gallery', catchAsync(addPostGalleryImages));
router.delete('/:postId/gallery/:index', catchAsync(deleteGalleryImage));

router.post(
  '/:postId/brochure',
  uploadTemporary.single('brochureFile'),
  catchAsync(addBrochure)
);

exports.postRoutes = router;
