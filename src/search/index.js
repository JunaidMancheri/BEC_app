const {respondSuccess} = require('../common/response.helper');
const {searchCourses} = require('../course/course.service');
const {searchPosts} = require('../post');

exports.searchPosts = async (req, res) => {
  if (!req.query.q) return res.status(204).json(respondSuccess({posts: [], courses: []})).end();
  const results = await Promise.all([
    searchPosts(req.query.q),
    searchCourses(req.query.q),
  ]);
  res.json(respondSuccess({posts: results[0], courses: results[1]})).end();
};
