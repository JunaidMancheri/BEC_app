const {Router} = require('express');
const {validateInputs} = require('../common/validators.utils');
const {
  createCourseValidator,
  createCourse,
  getCourses,
  updateCourseValidator,
  updateCourse,
  deleteCourse,
  getCourseAndProvidingColleges,
} = require('../course');
const {catchAsync} = require('../common/catchAsync.utils');
const {adminRouteGuard, populateUserDetails} = require('../auth');

const router = Router();

router.post(
  '/',
  adminRouteGuard,
  validateInputs(createCourseValidator),
  catchAsync(createCourse)
);

router.get('/', catchAsync(getCourses));

router.get('/:courseId', catchAsync(getCourseAndProvidingColleges))

router.put(
  '/:courseId',
  adminRouteGuard,
  validateInputs(updateCourseValidator),
  catchAsync(updateCourse)
);

router.delete('/:courseId', adminRouteGuard, catchAsync(deleteCourse));

exports.courseRoutes = router;
