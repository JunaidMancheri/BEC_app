const {Router} = require('express');
const {validateInputs} = require('../common/validators.utils');
const {
  createCourseValidator,
  createCourse,
  getCourses,
  updateCourseValidator,
  updateCourse,
  deleteCourse,
} = require('../course');
const {catchAsync} = require('../common/catchAsync.utils');

const router = Router();

router.post(
  '/',
  validateInputs(createCourseValidator),
  catchAsync(createCourse)
);

router.get('/', catchAsync(getCourses));

router.put(
  '/:courseId',
  validateInputs(updateCourseValidator),
  catchAsync(updateCourse)
);

router.delete('/:courseId', catchAsync(deleteCourse));


exports.courseRoutes = router;
