const {EventEmitter} = require('../common/EventEmitter');
const {respondSuccess} = require('../common/response.helper');
const {generateSlug} = require('../common/slug.helper');
const {CourseModel} = require('./model');
const {Conflict} = require('http-errors');
const {Types} = require('mongoose');

exports.createCourse = async (req, res) => {
  let doc;
  try {
    doc = await CourseModel.create({
      description: req.body.description,
      name: req.body.name,
      nameSlug: generateSlug(req.body.name),
      duration: Number(req.body.duration),
      type: req.body.type,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new Conflict('Course with this name already exists');
    }
    throw error;
  }
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

  const updates = {};

  if (req.body.name) {
    updates.name = req.body.name;
    updates.nameSlug = generateSlug(req.body.name);
  }
  if (req.body.description) updates.description = req.body.description;
  if (req.body.duration) updates.duration = Number(req.body.duration);
  if (req.body.type) updates.type = req.body.type;
  let doc;
  try {
    doc = await CourseModel.findByIdAndUpdate(req.params.courseId, updates, {
      new: true,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new Conflict('Course with this name already exists');
    }
    throw error;
  }
  res.json(respondSuccess(doc));
};

exports.deleteCourse = async (req, res) => {
  await CourseModel.findByIdAndDelete(req.params.courseId);
  EventEmitter.emit('Course:Deleted', {courseId: req.params.courseId});
  res.status(204).end();
};


exports.getCourseAndProvidingColleges = async (req, res) => {
  const pipeline = [
    {
      $match: { 
        _id: new Types.ObjectId(req.params.courseId)
      }
    },
    {
      $lookup: { 
        from: 'posts',
        localField: '_id',
        foreignField: 'courses',
        as: 'colleges'
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
        }
      }
    }
  ];
  const result = await CourseModel.aggregate(pipeline);
  res.json(respondSuccess(result[0]));
}