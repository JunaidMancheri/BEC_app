const {EventEmitter} = require('../common/EventEmitter');
const {PostModel} = require('./post.model');

EventEmitter.on('Category:StatusChanged', data => {
 PostModel.updateMany(
    {category: data.categoryId},
    {isCategoryActive: data.status}
  ).catch(()=>{});
});


EventEmitter.on('Amenity:Deleted', data => {
  PostModel.updateMany({
    $pull: {
      amenities: data.amenityId
    }
  }).catch(()=>{});
} )

EventEmitter.on('Course:Deleted', data => {
  PostModel.updateMany({
    $pull: {
      courses: data.courseId
    }
  }).catch(()=>{});
}) 