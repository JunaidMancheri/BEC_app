const {Schema, model} = require('mongoose');

const courseSchema = new Schema({
  name: {type: String, required: true},
  nameSlug : {type: String, required: true, unique: true},
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  type: {type: String, enum: ['undergraduate, postgraduate'], required: true},
});


exports.CourseModel = model('courses', courseSchema);