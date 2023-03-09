const { ErrorHandler } = require("../middleware/ErrorHandler");
const socialModal = require("../modal/socialModal");
const authModal = require("../modal/authModal");

exports.SocialMedia = async (req, res, next) => {
  let newPost;
  let findUser;
  const { title, text, userId } = req.body;

  try {
    findUser = await authModal.findOne({ id: userId });
  } catch (error) {
    return next(ErrorHandler("Fail to Post , Please try Again2", "error", 409));
  }

  try {
    const Email = findUser.email;
    const Name = findUser.name;
    // console.log(req.file.path);
    newPost = await new socialModal({
      title,
      text,
      userId,
      Email,
      Name,
      image: req.file ? req.file.path : "",
    });
    await newPost.save();
  } catch (error) {
    return next(ErrorHandler("Fail to Post , Please try Again", "error", 409));
  }

  res.status(200).json({ message: "success", post: req.body, user: findUser });
};

exports.getAllStatus = async (req, res, next) => {
  let AllStatus;

  try {
    AllStatus = await socialModal.find({});
  } catch (error) {
    return next(
      ErrorHandler("Fail to get Posts, Please try Again", "error", 409)
    );
  }

  res.status(200).json({ message: "success", allStatus: AllStatus });
};

exports.LikeStatus = async (req, res, next) => {
  let LikeStatus;
  let likes = [];
  let dislikes = [];
  try {
    const Status = await socialModal.findById(req.params.id);
    likes = Status.like;
    dislikes = Status.dislike;
    const TotalDislikes = dislikes.filter((d) => d !== req.body.userId);
    const TotalLikes = likes.filter((d) => d === req.body.userId);

    if (TotalLikes.map((e) => e === req.body.userId)[0]) {
      return res.status(200).json({ message: "already Liked", Status: "LIKE" });
    }
    likes.push(req.body.userId);
    LikeStatus = await socialModal.findByIdAndUpdate(req.params.id, {
      like: likes,
      dislike: TotalDislikes,
    });

    await LikeStatus.save();
  } catch (error) {
    ErrorHandler("Something went wrong, Please try Again", "error", 409);
  }

  res.status(200).json({ message: "success", Status: "LIKE" });
};

exports.DisLikeStatus = async (req, res, next) => {
  let LikeStatus;
  let likes = [];
  let dislikes = [];
  try {
    const Status = await socialModal.findById(req.params.id);
    likes = Status.like;
    dislikes = Status.dislike;
    const Totallikes = likes.filter((l) => l !== req.body.userId);
    const TotalDislike = dislikes.filter((e) => e === req.body.userId);
    if (TotalDislike.map((d) => d === req.body.userId)[0]) {
      return res
        .status(200)
        .json({ message: "already DisLiked", Status: "DISLIKE" });
    }
    dislikes.push(req.body.userId);
    LikeStatus = await socialModal.findByIdAndUpdate(req.params.id, {
      dislike: dislikes,
      like: Totallikes,
    });

    await LikeStatus.save();
  } catch (error) {
    ErrorHandler("Something went wrong, Please try Again", "error", 409);
  }

  res.status(200).json({ message: "success", Status: "DISLIKE" });
};
