const User = require("../models/User");
const Recruiter = require("../models/Recruiter");
const Applicant = require("../models/Applicant");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });

  let extraData = null;

  if (user.role === "recruiter") {
    extraData = await Recruiter.findOne({ user: user._id });
  }

  if (user.role === "applicant") {
    extraData = await Applicant.findOne({ user: user._id });
  }

  res.json({ user, extraData });
};

exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  await user.save();

  res.json({ message: "Profile updated successfully" });
};