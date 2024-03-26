const {EventEmitter} = require('../common/EventEmitter');
const {PostModel} = require('./post.model');

EventEmitter.on('Category:StatusChanged', async data => {
  await PostModel.updateMany(
    {category: data.categoryId},
    {isCategoryActive: data.status}
  );
});
