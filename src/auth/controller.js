const { createAdmin } = require("../admin")

exports.registerAdmin = async (req, res) => {
  const email = validateToken(req.body.token);
  const admin = await createAdmin(req.body.email, req.body.password);
  res.json(respondSuccess(admin)).status(201);
}