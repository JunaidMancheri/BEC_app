const {respondSuccess} = require('../common/response.helper');
const {generateFilename} = require('../common/upload.helper');
const {generateSlug} = require('../common/slug.helper');
const {Conflict, BadRequest} = require('http-errors');
const {join} = require('path');
const fs = require('fs');
const { amenityModel } = require('./amenity.model');

/**
 * @type {import("../..").ExpressController}
 */
exports.createAmenity = async (req, res, next) => {
  if (!req.file) throw new BadRequest('image is required');

  const filename = generateFilename(req.file.mimetype);
  let doc;
  try {
    doc = await amenityModel.create({
      nameSlug: generateSlug(req.body.name),
      name: req.body.name,
      imageUrl: `/uploads/amenities/${filename}`,
    });
  } catch (error) {
    if (error.code === 11000)
      throw new Conflict('Amenity already exists');
  }

  await fs.promises.writeFile(
    join('public', 'uploads', 'amenities', filename),
    req.file.buffer
  );

  return res.json(respondSuccess(doc));
}

exports.getAmenities = async (req, res) => {
  const amenities  = await amenityModel.find({}, '-nameSlug');
  return res.json(respondSuccess(amenities));
}