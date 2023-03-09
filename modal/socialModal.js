const { default: mongoose } = require("mongoose");

const socialSchema = mongoose.Schema({
  title: { type: String, required: "Status must have a title" },
  text: { type: String },
  image: { type: String },
  video: { type: String },
  userId: { type: String, required: "user id is required" },
  Email: { type: String, required: "user email is required" },
  Name: { type: String, required: "User name is required" },
  like: { type: [String], default: [] },
  dislike: { type: [String], default: [] },
});

module.exports = mongoose.model("Social", socialSchema);
 