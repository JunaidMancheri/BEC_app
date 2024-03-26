const { EventEmitter } = require("../common/EventEmitter");
const { respondSuccess } = require("../common/response.helper");
const { CourseModel } = require("./model")

exports.createCourse = async (req, res) =>  {
  const doc = await CourseModel.create({
    description: req.body.description,
    name: req.body.name,
    duration: Number(req.body.duration),
    type: req.body.type,
  })

  res.json(respondSuccess(doc)).status(201);
}

exports.getCourses = async (req, res) => {
  const courses = await CourseModel.find();
  res.json(respondSuccess(courses));
}


// check if we can combine this to single db call;
exports.updateCourse = async (req, res) => {
  if (Object.keys(req.body).length ==0) {
    return res.status(204).end();
  }

  const doc = await CourseModel.findById(req.params.courseId);

  if (req.body.name) doc.name = req.body.name;
  if (req.body.description) doc.description = req.body.description;
  if (req.body.duration) doc.duration = Number(req.body.duration);
  if (req.body.type) doc.type = req.body.type;

  await doc.save();
  res.json(respondSuccess(doc));
}

exports.deleteCourse = async (req, res) => {
  await CourseModel.findByIdAndDelete(req.params.courseId);
  EventEmitter.emit('Course:Deleted', {courseId: req.params.courseId});
  res.status(204).end();
}