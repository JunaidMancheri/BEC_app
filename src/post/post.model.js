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
  gallery: [
    {
      type: String,
      validate: {
        validator: function (v) {
          return this.gallery.length <= 4;
        },
        message: 'Gallery can contain at most 4 images',
      },
    },
  ],
  contactNumber: {
    type: Number,
    required: true,
  },
  brochureUrl: String,
});


exports.PostModel = model('posts', postSchema);