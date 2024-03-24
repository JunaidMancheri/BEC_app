const { Schema, model } = require("mongoose");

const amenitySchema = new Schema({
  nameSlug: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
})

exports.amenityModel = model('amenities', amenitySchema);