const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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