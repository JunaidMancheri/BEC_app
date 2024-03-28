const {BadRequest, Conflict} = require('http-errors');
const {PostModel} = require('./post.model');
const {getCategoryStatus} = require('../category');
const {
  generateFilename,
  generatePdfFilename,
} = require('../common/upload.helper');
const fs = require('fs');
const {join} = require('path');
const {respondSuccess} = require('../common/response.helper');

/**
 * @type {import("../..").ExpressController}
 */
exports.createPost = async (req, res) => {
  if (!req.files) throw new BadRequest('Images are required');
  if (!req.files['coverImage']) throw new BadRequest('coverImage is required');
  if (!req.files['gallery'])
    throw new BadRequest('gallery images are required');
  if (req.files['gallery'].length > 4)
    throw new BadRequest('gallery images can be only upto 4 images');

  let pdfFilename;
  if (req.files['brochureFile']) {
    pdfFilename = generatePdfFilename();
    fs.promises.writeFile(
      join('public', 'uploads', 'pdf', pdfFilename),
      req.files['brochureFile'][0].buffer
    );
  }

  const coverImageName = generateFilename(req.files['coverImage'][0].mimetype);
  fs.promises.writeFile(
    join('public', 'uploads', 'posts', coverImageName),
    req.files['coverImage'][0].buffer
  );

  const gallery = [];
  req.files['gallery'].forEach(file => {
    const filename = generateFilename(file.mimetype);
    fs.promises.writeFile(
      join('public', 'uploads', 'posts', filename),
      file.buffer
    );
    gallery.push(`/uploads/posts/${filename}`);
  });

  const doc = await PostModel.create({
    gallery,
    isActive: true,
    title: req.body['title'],
    courses: req.body['courses'],
    category: req.body['category'],
    amenities: req.body['amenities'],
    description: req.body['description'],
    contactNumber: req.body['contactNumber'],
    coverImageUrl: `/uploads/posts/${coverImageName}`,
    isCategoryActive: await getCategoryStatus(req.body['category']),
    brochureUrl: pdfFilename ? `/uploads/pdf/${pdfFilename}` : undefined,
  });

  res.status(201).json(respondSuccess(doc));
};

exports.getAllPosts = async (req, res, next) => {
  const posts = await PostModel.find()
    .populate('amenities')
    .populate('courses');
  return res.json(respondSuccess(posts));
};

exports.getPostsOfACategory = async (req, res, next) => {
  const posts = await PostModel.find({
    category: req.params.categoryId,
    isActive: true,
    isCategoryActive: true,
  })
    .populate('amenities')
    .populate('courses');
  return res.json(respondSuccess(posts));
};

exports.getCoursesOfAPost = async (req, res) => {
  const post = await PostModel.findById(
    req.params.postId,
    '-_id courses'
  ).populate('courses');

  return res.json(respondSuccess(post.courses));
};

exports.getSinglePost = async (req, res, next) => {
  const post = await PostModel.findById(req.params.postId, {
    isActive: true,
    isCategoryActive: true,
  })
    .populate('amenities')
    .populate('courses');
  return res.json(respondSuccess(post));
};

exports.updatePostDetails = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(204).end();
  }
  const updates = {};
  if (req.body.title) {
    updates.title = req.body.title;
  }

  if (req.body.description) {
    updates.description = req.body.description;
  }

  if (req.body.contactNumber) {
    updates.contactNumber = req.body.contactNumber;
  }

  if (req.body.amenities) {
    updates.amenities = req.body.amenities;
  }

  if (req.body.courses) {
    updates.courses = req.body.courses;
  }

  if (req.body.category) {
    updates.category = req.body.category;
  }

  const doc = await PostModel.findByIdAndUpdate(req.params.postId, updates);
  return res.json(respondSuccess(doc));
};

exports.addPostGalleryImages = async (req, res, next) => {
  if (!req.files) {
    return res.status(204).end();
  }

  if (!req.files.length > 4) {
    throw new BadRequest('Gallery can contain only up to 4 images');
  }

  const postDoc = await PostModel.findById(req.params.postId, '-_id gallery');

  if (postDoc.gallery.length + req.files.length > 4) {
    throw new BadRequest(
      `Can't add ${req.files.length} more images, since gallery already contains ${postDoc.gallery.lenght} images and a maximum number of 4 images are only allowed`
    );
  }

  const gallery = [];
  req.files.forEach(file => {
    const filename = generateFilename(file.mimetype);
    fs.promises.writeFile(
      join('public', 'uploads', 'posts', filename),
      file.buffer
    );
    gallery.push(`/uploads/posts/${filename}`);
  });

  postDoc.gallery = [...postDoc.gallery, ...gallery];
  const newPostDoc = await postDoc.save({new: true});
  return res.json(respondSuccess(newPostDoc));
};

exports.deleteGalleryImage = async (req, res, next) => {
  const postDoc = await PostModel.findById(req.params.postId);
  const url = postDoc.gallery.splice(Number(req.params.index), 1);
  fs.promises.unlink(join('public', url));
  await postDoc.save();
  res.status(204).end();
};

exports.addBrochure = async (req, res, next) => {
  if (!req.file) throw new BadRequest('brochureFile is required');
  const postDoc = await PostModel.findById(req.params.postId);
  if (postDoc.brochureUrl) {
    throw new Conflict('A brochure has already been added');
  }
  const pdfFilename = generatePdfFilename();
  fs.promises.writeFile(
    join('public', 'uploads', 'pdf', pdfFilename),
    req.file.buffer
  );
  postDoc.brochureUrl = `/uploads/pdf/${pdfFilename}`;
  await postDoc.save();
  res.status(201).end();
};

exports.deleteBrochure = async (req, res, next) => {
  const postDoc = await PostModel.findById(req.params.postId);
  if (postDoc.brochureUrl) {
    fs.promises.unlink(join('public', postDoc.brochureUrl));
    postDoc.brochureUrl = undefined;
    await postDoc.save();
  }
  res.status(204).end();
};

exports.updateCoverImage = async (req, res, next) => {
  if (!req.file) {
    throw new BadRequest('coverImage is required');
  }

  const postDoc = await PostModel.findById(
    req.params.postId,
    '-_id coverImageUrl'
  );
  const filename = generateFilename(req.file.mimetype);
  const fileUrl = `/uploads/posts/${filename}`;
  await fs.promises.writeFile(join('public', fileUrl), req.file.buffer);
  fs.promises.unlink(join('public', postDoc.coverImageUrl));
  await postDoc.save();
  res.status(200).end();
};

exports.toggleStatus = async (req, res, next) => {
  const postDoc = await PostModel.findById(req.params.id);
  postDoc.isActive = !postDoc.isActive;
  await postDoc.save();
  res.end();
};

exports.deletePost = async (req, res, next) => {
  await PostModel.findByIdAndDelete(req.params.id);
  res.status(204).end();
};

exports.getPostsProvidingACourse = async (req, res) => {
  const results = await PostModel.find(
    {courses: req.params.courseId},
    'coverImageUrl title'
  );
  res.json(respondSuccess(results));
};
