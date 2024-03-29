const {PostModel} = require('./post.model');

exports.searchPosts = async query => {
  return await PostModel.find({title: {$regex: new RegExp('^' + query, 'i')}}, 'title');
};
