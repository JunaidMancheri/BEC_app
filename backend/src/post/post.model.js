const {Schema, model} = require('mongoose');

const postSchema = new Schema({
  coverImageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories',
  },
  isCategoryActive: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amenities: {
    type: [{type: Schema.Types.ObjectId, ref: 'amenities'}],
  },
  courses: {
    type: [{type: Schema.Types.ObjectId, ref: 'courses'}],
  },
  gallery: [String],
  contactNumber: {
    type: Number,
    required: true,
  },
  brochureUrl: String,
});

exports.PostModel = model('posts', postSchema);
