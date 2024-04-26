const {EventEmitter} = require('../common/EventEmitter');
const {makeLogger} = require('../common/logger.config');
const {respondSuccess} = require('../common/response.helper');
const {generateSlug} = require('../common/slug.helper');
const {CourseModel} = require('./model');
const {Conflict, BadRequest, NotFound} = require('http-errors');
const {Types} = require('mongoose');

const Logger = makeLogger('Course');

exports.createCourse = async (req, res) => {
  if (isNaN(Number(req.body.years)))
    throw new BadRequest('years should be a number');
  if (isNaN(Number(req.body.months)))
    throw new BadRequest('months should be a number');
  let doc;
  try {
    doc = await CourseModel.create({
      description: req.body.description,
      name: req.body.name,
      nameSlug: generateSlug(req.body.name),
      duration: {
        years: parseInt(req.body.years),
        months: parseInt(req.body.months),
      },
      type: req.body.type,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new Conflict('Course with this name already exists');
    }
    throw error;
  }

  Logger.info('Created ' + doc.name);
  res.json(respondSuccess(doc)).status(201);
};

exports.getCourses = async (req, res) => {
  const courses = await CourseModel.find();
  res.json(respondSuccess(courses));
};

exports.updateCourse = async (req, res) => {
  if (Object.keys(req.body).length == 0) {
    return res.status(204).end();
  }

  let doc = await CourseModel.findById(req.params.courseId);
  if (!doc) throw new NotFound('Course not found');

  if (req.body.name) {
    doc.name = req.body.name;
    doc.nameSlug = generateSlug(req.body.name);
  }
  if (req.body.description) doc.description = req.body.description;
  if (req.body.years) {
    if (isNaN(Number(req.body.years)))
      throw new BadRequest('years should be of type number');
    doc.duration.years = Number(req.body.years);
  }

  if (req.body.months) {
    if (isNaN(Number(req.body.months)))
      throw new BadRequest('months should be of type number');
    doc.duration.months = Number(req.body.months);
  }
  if (req.body.type) doc.type = req.body.type;
  try {
    await doc.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new Conflict('Course with this name already exists');
    }
    throw error;
  }

  Logger.info('updated course ' + doc.name);
  res.json(respondSuccess(doc));
};

exports.deleteCourse = async (req, res) => {
  await CourseModel.findByIdAndDelete(req.params.courseId);
  EventEmitter.emit('Course:Deleted', {courseId: req.params.courseId});

  Logger.info('deleted  course ' + req.params.courseId);
  res.status(204).end();
};

exports.getCourseAndProvidingColleges = async (req, res) => {
  const pipeline = [
    {
      $match: {
        _id: new Types.ObjectId(req.params.courseId),
      },
    },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'courses',
        as: 'colleges',
      },
    },
    {
      $project: {
        name: 1,
        duration: 1,
        description: 1,
        type: 1,
        colleges: {
          _id: 1,
          title: 1,
          coverImageUrl: 1,
        },
      },
    },
  ];
  const result = await CourseModel.aggregate(pipeline);
  if (!result[0]) throw new NotFound('Course not found');
  res.json(respondSuccess(result[0]));
};
