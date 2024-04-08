const {CourseModel} = require('./model');

exports.searchCourses = async query => {
  return await CourseModel.find({name: {$regex: new RegExp('^' + query, 'i')}}, 'name');
};
