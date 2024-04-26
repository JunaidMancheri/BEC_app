const {Schema, model} = require('mongoose');

const durationSchema = new Schema({
  years: {
    type: Number,
    default: 0,
  },
  months: {
    type: Number,
    default: 0,
  }
}, {_id: false})

const courseSchema = new Schema({
  name: {type: String, required: true},
  nameSlug : {type: String, required: true, unique: true},
  description: {type: String, required: true},
  duration: {type: durationSchema, required: true},
  type: {type: String, enum: ['undergraduate', 'postgraduate'], required: true},
});


exports.CourseModel = model('courses', courseSchema);