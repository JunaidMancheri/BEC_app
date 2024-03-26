const { Schema, model } = require("mongoose");

const bannerSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  }
})


exports.BannerModel = model('banners', bannerSchema);