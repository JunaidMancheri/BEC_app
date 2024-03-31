const {BadRequest, Conflict, NotFound} = require('http-errors');
const {PostModel} = require('./post.model');
const {getCategoryStatus} = require('../category');
const {
  generateFilename,
  generatePdfFilename,
} = require('../common/upload.helper');
const fs = require('fs');
const {join} = require('path');
const {respondSuccess} = require('../common/response.helper');
const {appConfig} = require('../config/app.config');
const {
  cloudinary,
  isCloudinaryUrl,
  getPublicId,
} = require('../common/cloudinary.service');
const {extractFilePathFromUrl} = require('../common/utils');
const { makeLogger } = require('../common/logger.config');


const Logger =  makeLogger('Post');

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
  let pdfFilePath;
  if (req.files['brochureFile']) {
    pdfFilename = generatePdfFilename();
    pdfFilePath = join('public', 'uploads', 'pdf', pdfFilename);
    fs.promises.writeFile(pdfFilePath, req.files['brochureFile'][0].buffer);
  }

  const coverImageName = generateFilename(req.files['coverImage'][0].mimetype);
  let coverImagePath = join('public', 'uploads', 'posts', coverImageName);
  fs.promises.writeFile(coverImagePath, req.files['coverImage'][0].buffer);

  const gallery = [];
  const galleryFilePaths = [];
  req.files['gallery'].forEach(file => {
    const filename = generateFilename(file.mimetype);
    const filePath = join('public', 'uploads', 'posts', filename);
    galleryFilePaths.push(filePath);
    fs.promises.writeFile(filePath, file.buffer);
    gallery.push(`${appConfig.APP_BASE_URL}/uploads/posts/${filename}`);
  });

  const doc = await PostModel.create({
    gallery,
    isActive: true,
    title: req.body['title'],
    category: req.body['category'],
    description: req.body['description'],
    contactNumber: req.body['contactNumber'],
    courses: Array.from(new Set(req.body['courses'])),
    amenities: Array.from(new Set(req.body['amenities'])),
    coverImageUrl: `${appConfig.APP_BASE_URL}/uploads/posts/${coverImageName}`,
    isCategoryActive: await getCategoryStatus(req.body['category']),
    brochureUrl: pdfFilename
      ? `${appConfig.APP_BASE_URL}/uploads/pdf/${pdfFilename}`
      : undefined,
  });


  Logger.info('Created post ' + doc.title);

  res.status(201).json(respondSuccess(doc)).end();

  const promises = [
    ...galleryFilePaths.map(filePath => cloudinary.uploader.upload(filePath)),
    cloudinary.uploader.upload(coverImagePath),
  ];
  const results = await Promise.allSettled(promises);

  Logger.info('Uploaded images  to cloudinary for post ' +  doc.title);

  const publicIds = {
    gallery: [null, null, null, null],
    coverImage: null,
  };

  for (let index = 0; index < results.length; index++) {
    const result = results[index];
    if (result.status === 'rejected') continue;
    const {url, public_id} = result.value;
    if (index < galleryFilePaths.length) {
      publicIds.gallery[index] = public_id;
      doc.gallery[index] = url;
    } else {
      publicIds.coverImage = public_id;
      doc.coverImageUrl = url;
    }
  }

  doc
    .save()
    .then(() => {

      Promise.allSettled([
        ...galleryFilePaths.map((filepath, index) => {
          if (publicIds.gallery[index]) {
            return fs.promises.unlink(filepath);
          }
        }),
        publicIds.coverImage && fs.promises.unlink(coverImagePath),
      ]);
      Logger.info('cleaned up disk space of  locally saved images for  post ' + doc.title);
    })
    .catch(() => {
      Promise.allSettled([
        ...galleryFilePaths.map((val, index) =>
          cloudinary.uploader.destroy(publicIds.gallery[index])
        ),
        cloudinary.uploader.destroy(publicIds.coverImage),
      ]);
      Logger.info('db failed to save  updates... deleting files from cloudinary for post ' + doc.title);
    });
};

exports.getAllPosts = async (req, res, next) => {
  const posts = await PostModel.find()
    .populate('amenities')
    .populate('courses')
    .populate('category')
  return res.json(respondSuccess(posts));
};

exports.getPostsOfACategory = async (req, res, next) => {
  let filter = {isActive: true, isCategoryActive: true};
  if (req.user?.isAdmin) filter = {};

  const posts = await PostModel.find({
    category: req.params.categoryId,
    ...filter,
  })
    .populate('amenities')
    .populate('courses')
    .populate('category')
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

  let filter = {isActive: true, isCategoryActive: true};
  if (req.user?.isAdmin) filter = {};

  const post = await PostModel.findOne({_id: req.params.postId,...filter})
    .populate('amenities')
    .populate('courses')
    .populate('category');
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
    updates.amenities = Array.from(new Set(req.body.amenities));
  }

  if (req.body.courses) {
    updates.courses = Array.from(new Set(req.body.courses));
  }

  if (req.body.category) {
    updates.category = req.body.category;
  }

  const doc = await PostModel.findByIdAndUpdate(req.params.postId, updates, {new: true});
  if (!doc) throw new NotFound('Post not found');
  Logger.info('Details updated for the post ' + req.params.postId);
  return res.json(respondSuccess(doc));
};

exports.addPostGalleryImages = async (req, res, next) => {
  if (!req.files) {
    throw new BadRequest('gallery images are required');
  }

  if (req.files.length > 4) {
    throw new BadRequest('Gallery can contain only up to 4 images');
  }

  const postDoc = await PostModel.findById(req.params.postId, 'gallery');
  if (!postDoc) throw new NotFound('Post not found');

  const currentGalleryLength = postDoc.gallery.length
  if (currentGalleryLength + req.files.length > 4) {
    throw new BadRequest(
      `Can't add ${req.files.length} more images, since gallery already contains ${postDoc.gallery.length} images and a maximum number of 4 images are only allowed`
    );
  }

  const gallery = [];
  const galleryFilePaths = [];
  req.files.forEach(file => {
    const filename = generateFilename(file.mimetype);
    const filePath = join('public', 'uploads', 'posts', filename);
    fs.promises.writeFile(filePath, file.buffer);
    galleryFilePaths.push(filePath);
    gallery.push(`${appConfig.APP_BASE_URL}/uploads/posts/${filename}`);
  });

  postDoc.gallery = [...postDoc.gallery, ...gallery];
  await postDoc.save();

  Logger.info('Added new gallery images for the post ' + postDoc.title);
  res.json(respondSuccess(postDoc));

  const promises = [
    ...galleryFilePaths.map(filePath => cloudinary.uploader.upload(filePath)),
  ];

  const results = await Promise.allSettled(promises);

  Logger.info('Gallery images uploaded  to cloudinary for post ' + postDoc.title);

  const publicIds = [];

  for (let index = 0; index < results.length; index++) {
    const result = results[index];
    if (result.status === 'rejected') continue;
    const {url, public_id} = result.value;
    publicIds[index] = public_id;
    postDoc.gallery[currentGalleryLength + index] = url;
  }

  postDoc
    .save()
    .then(() => {
      Promise.allSettled([
        ...galleryFilePaths.map((filepath, index) => {
          if (publicIds[index]) {
            return fs.promises.unlink(filepath);
          }
        }),
      ]);
    })
    .catch((err) => {
      Logger.error(err.message);
      Promise.allSettled([
        ...galleryFilePaths.map((val, index) =>
          cloudinary.uploader.destroy(publicIds[index])
        ),
      ]);
    });
};

exports.deleteGalleryImage = async (req, res, next) => {
  const postDoc = await PostModel.findById(req.params.postId);
  if (!postDoc) throw new NotFound('Post not found');
  const urls = postDoc.gallery.splice(Number(req.params.index), 1);
  await postDoc.save();

  Logger.info('gallery image deleted for post ' + postDoc.title);
  res.status(204).end();

  if (urls.length ==0) return; 
  if (isCloudinaryUrl(urls[0])) {
    cloudinary.uploader.destroy(getPublicId(urls[0])).catch(() => {});
  } else {
    fs.promises.unlink(extractFilePathFromUrl(urls[0])).catch(() => {});
  }
};

exports.addBrochure = async (req, res, next) => {
  if (!req.file) throw new BadRequest('brochureFile is required');
  const postDoc = await PostModel.findById(req.params.postId);
  if (!postDoc) throw new NotFound('Post not found');
  if (postDoc.brochureUrl) {
    throw new Conflict('A brochure has already been added');
  }
  const pdfFilename = generatePdfFilename();
  await fs.promises.writeFile(
    join('public', 'uploads', 'pdf', pdfFilename),
    req.file.buffer
  );
  postDoc.brochureUrl = `${appConfig.APP_BASE_URL}/uploads/pdf/${pdfFilename}`;
  await postDoc.save();

  Logger.info('Brochure added for post  ' + postDoc.title);
  res.json(respondSuccess(postDoc)).status(201).end();
};

exports.deleteBrochure = async (req, res, next) => {
  const postDoc = await PostModel.findById(req.params.postId);
  if (!postDoc) throw new NotFound('Post not found');
  if (postDoc.brochureUrl) {
    fs.promises.unlink(extractFilePathFromUrl(postDoc.brochureUrl)).catch(()=>{});
    postDoc.brochureUrl = undefined;
    await postDoc.save();

    Logger.info('Brochure deleted for post  ' + postDoc.title);
  }
  res.status(204).end();
};

exports.updateCoverImage = async (req, res, next) => {
  if (!req.file) {
    throw new BadRequest('coverImage is required');
  }

  const postDoc = await PostModel.findById(
    req.params.postId,
    'coverImageUrl'
  );

  if (!postDoc) throw new NotFound('Post not found');

  const oldFileUrl = postDoc.coverImageUrl;

  const filename = generateFilename(req.file.mimetype);
  const filePath = join('public', 'uploads', 'posts', filename);
  postDoc.coverImageUrl = `${appConfig.APP_BASE_URL}/uploads/posts/${filename}`;
  await fs.promises.writeFile(filePath, req.file.buffer);
  await postDoc.save();

  Logger.info('Updated cover image for post ' + postDoc._id);
  res.json(respondSuccess(postDoc)).end();

  cloudinary.uploader.upload(filePath, async (err, info) => {
    try {
      if (err) return;
      postDoc.coverImageUrl = info.url;
      await postDoc.save();
      fs.promises.unlink(filePath).catch(() => {});
    } catch (error) {
      cloudinary.uploader.destroy(info.public_id).catch(() => {});
    }
  });

  if (isCloudinaryUrl(oldFileUrl)) {
    cloudinary.uploader.destroy(getPublicId(oldFileUrl)).catch(() => {});
  } else {
    fs.promises.unlink(extractFilePathFromUrl(oldFileUrl)).catch(() => {});
  }
};

exports.toggleStatus = async (req, res, next) => {
  const postDoc = await PostModel.findById(req.params.postId);
  if (!postDoc) throw new NotFound('Post not found');
  postDoc.isActive = !postDoc.isActive;
  await postDoc.save();

  Logger.info('Status changed to ' + postDoc.isActive + ' for post ' + postDoc.title);
  res.json(respondSuccess(postDoc));
};

exports.deletePost = async (req, res, next) => {
  const doc = await PostModel.findByIdAndDelete(req.params.postId);

  Logger.info('Post deleted ' + doc.title);
  res.status(204).end();

  if (!doc) return;

  if (doc.brochureUrl)
    fs.promises.unlink(extractFilePathFromUrl(doc.brochureUrl)).catch(() => {});

  const filesToDelete = [
    {url: doc.coverImageUrl, isCloudinary: isCloudinaryUrl(doc.coverImageUrl)},
    ...doc.gallery.map(url => ({url, isCloudinary: isCloudinaryUrl(url)})),
  ];

  Promise.allSettled(
    filesToDelete.map(async ({url, isCloudinary}) => {
      if (isCloudinary) {
        return cloudinary.uploader.destroy(getPublicId(url));
      } else {
        return fs.promises.unlink(extractFilePathFromUrl(url));
      }
    })
  ).then(() => Logger.info('Cleaned up post files ' + doc.title));
};

exports.getPostsProvidingACourse = async (req, res) => {
  const results = await PostModel.find(
    {courses: req.params.courseId},
    'coverImageUrl title'
  );
  res.json(respondSuccess(results));
};
