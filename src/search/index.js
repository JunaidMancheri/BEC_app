const {respondSuccess} = require('../common/response.helper');
const { searchPosts } = require('../post');

exports.searchPosts = async (req, res) => {
  if (!req.query.q) return res.status(204).json(respondSuccess([])).end();
  const results = await searchPosts(req.query.q);
  res.json(respondSuccess(results));
};
