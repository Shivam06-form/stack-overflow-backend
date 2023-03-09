const express = require("express");
const {
  SocialMedia,
  getAllStatus,
  LikeStatus,
  DisLikeStatus,
} = require("../controller/social-controll");
const fileUpload = require("../middleware/ImageUploade");
// const fileUpload2 = require("../middleware/videoUploade");
const router = express.Router();

router.post(
  "/shareStatus",
  fileUpload.single("image"),
  // fileUpload2.single("video"),
  SocialMedia
);
router.get("/getAllStatus", getAllStatus);

module.exports = router;

router.patch("/like/:id", LikeStatus);
router.patch("/dislike/:id", DisLikeStatus);
