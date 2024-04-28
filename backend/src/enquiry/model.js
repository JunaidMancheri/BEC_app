const { Schema, model } = require("mongoose");

const enquirySchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
     ref: 'posts'
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'courses'
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  note: {
    type: String,
  },
  type: {
    type: String,
    enum: ['general', 'specialized'],
    required: true
  }
}, {timestamps: true});


exports.EnquiryModel = model('enquiries', enquirySchema);