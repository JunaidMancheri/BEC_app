const {respondSuccess} = require('../common/response.helper');
const {searchCourses} = require('../course/course.service');
const {searchPosts} = require('../post');
const {BadRequest} = require('http-errors');

exports.searchPosts = async (req, res) => {
  if (!req.query.query) throw new BadRequest('Query missing, provide query for search');
  const results = await Promise.all([
    searchPosts(req.query.query),
    searchCourses(req.query.query),
  ]);
  res.json(respondSuccess({posts: results[0], courses: results[1]})).end();
};
