const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  nameSlug: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  isActive : {
    type: Boolean,
    default: true,
  },
  imageUrl: {
    type: String,
  },
})


exports.categoryModel = model('categories', categorySchema);