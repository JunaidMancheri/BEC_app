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
const {appConfig} = require('../config/app.config');
const {
  cloudinary,
  isCloudinaryUrl,
  getPublicId,
} = require('../common/cloudinary.service');
const {extractFilePathFromUrl} = require('../common/utils');

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
    courses: req.body['courses'],
    category: req.body['category'],
    amenities: req.body['amenities'],
    description: req.body['description'],
    contactNumber: req.body['contactNumber'],
    coverImageUrl: `${appConfig.APP_BASE_URL}/uploads/posts/${coverImageName}`,
    isCategoryActive: await getCategoryStatus(req.body['category']),
    brochureUrl: pdfFilename
      ? `${appConfig.APP_BASE_URL}/uploads/pdf/${pdfFilename}`
      : undefined,
  });

  res.status(201).json(respondSuccess(doc)).end();

  const promises = [
    ...galleryFilePaths.map(filePath => cloudinary.uploader.upload(filePath)),
    cloudinary.uploader.upload(coverImagePath),
  ];
  const results = await Promise.allSettled(promises);

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
    })
    .catch(() => {
      Promise.allSettled([
        ...galleryFilePaths.map((val, index) =>
          cloudinary.uploader.destroy(publicIds.gallery[index])
        ),
        cloudinary.uploader.destroy(publicIds.coverImage),
      ]);
    });
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
    throw new BadRequest('gallery images are required');
  }

  if (!req.files.length > 4) {
    throw new BadRequest('Gallery can contain only up to 4 images');
  }

  const postDoc = await PostModel.findById(req.params.postId, '-_id gallery');

  const currentGalleryLength = postDoc.gallery.length;
  if (currentGalleryLength + req.files.length > 4) {
    throw new BadRequest(
      `Can't add ${req.files.length} more images, since gallery already contains ${postDoc.gallery.lenght} images and a maximum number of 4 images are only allowed`
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
  res.json(respondSuccess(postDoc));

  const promises = [
    ...galleryFilePaths.map(filePath => cloudinary.uploader.upload(filePath)),
  ];

  const results = await Promise.allSettled(promises);

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
          if (publicIds.gallery[index]) {
            return fs.promises.unlink(filepath);
          }
        }),
      ]);
    })
    .catch(() => {
      Promise.allSettled([
        ...galleryFilePaths.map((val, index) =>
          cloudinary.uploader.destroy(publicIds.gallery[index])
        ),
      ]);
    });
};

exports.deleteGalleryImage = async (req, res, next) => {
  const postDoc = await PostModel.findById(req.params.postId);
  const url = postDoc.gallery.splice(Number(req.params.index), 1);
  await postDoc.save();
  res.status(204).end();
  if (isCloudinaryUrl(url)) {
    cloudinary.uploader.destroy(getPublicId(url)).catch(() => {});
  } else {
    fs.promises.unlink(extractFilePathFromUrl(url)).catch(() => {});
  }
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

  const oldFileUrl = postDoc.coverImageUrl;

  const filename = generateFilename(req.file.mimetype);
  const filePath = join('public', 'uploads', 'posts', filename);
  postDoc.coverImageUrl = `${appConfig.APP_BASE_URL}/uploads/posts/${filename}`;
  await fs.promises.writeFile(filePath, req.file.buffer);
  await postDoc.save();
  res.status(200).end();

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
  const postDoc = await PostModel.findById(req.params.id);
  postDoc.isActive = !postDoc.isActive;
  await postDoc.save();
  res.json(respondSuccess(postDoc));
};

exports.deletePost = async (req, res, next) => {
  const doc = await PostModel.findByIdAndDelete(req.params.postId);
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
      console.log(url, isCloudinary);
      if (isCloudinary) {
        return cloudinary.uploader.destroy(getPublicId(url));
      } else {
        return fs.promises.unlink(extractFilePathFromUrl(url));
      }
    })
  );
};

exports.getPostsProvidingACourse = async (req, res) => {
  const results = await PostModel.find(
    {courses: req.params.courseId},
    'coverImageUrl title'
  );
  res.json(respondSuccess(results));
};
