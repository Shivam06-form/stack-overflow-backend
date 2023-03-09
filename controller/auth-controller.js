const stripe = require("stripe")(
  "sk_test_51JyFrhSE6AQGMykvHP6MJ8SCj6sndySQabTbeq4UbzzyH1lx0OPt2DAjZJhffL0H90hyfpQBkRGJreiTXfh4D6ud00iKgRUcqc"
);
const { ErrorHandler } = require("../middleware/ErrorHandler");
const authModal = require("../modal/authModal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.AuthSignup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (+password.length <= 6) {
    const error = ErrorHandler(
      "Password Should be 6 + characters",
      "error",
      404
    );
    return next(error);
  }
  const ExsistEmail = await authModal.findOne({ email: email });
  try {
    if (ExsistEmail) {
      return next(
        ErrorHandler(
          "User exists already , please try another name",
          "error",
          404
        )
      );
    }
  } catch (error) {
    return next(ErrorHandler("Something Went Wrong", "error", 504));
  }

  if (email && password && name) {
    let hashPassword = await bcrypt.hash(password, 12);

    const createdUser = new authModal({
      name,
      email,
      password: hashPassword,
      about: req.body.about,
      tags: req.body.tags,
      joinedOn: new Date(Date.now()),
    });
    await createdUser.save();

    let token;
    let id;
    try {
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        "supersecreat_dnot_share",
        {
          expiresIn: "1h",
        }
      );

      id = createdUser.id.toString();
    } catch (err) {
      return next(
        ErrorHandler("Signing up failed , please try again", "error", 500)
      );
    }

    return res.status(200).json({
      title: "Signup",
      Message: "succefully Signup",
      token,
      id: createdUser.id.toString(),
    });
  } else {
    return next(ErrorHandler("One of the field is empty", "error", 401));
  }
};

exports.AuthLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let validPassword;
  let token;
  let id;
  try {
    let findUser = await authModal.findOne({ email: email });
    validPassword = await bcrypt.compare(password, findUser.password);
    id = findUser._id.toString();
    token = jwt.sign(
      { userId: findUser.id, email: findUser.email },
      "supersecreat_dnot_share",
      {
        expiresIn: "1h",
      }
    );

    if (!validPassword) {
      return next(ErrorHandler("Wrong Password or Email 🔥", "error", 401));
    }
  } catch (error) {
    return next(
      ErrorHandler(
        "Signing up failed Maybe Wrong Email or Password, please try again",
        "error",
        500
      )
    );
  }

  return res.status(200).json({
    title: "login",
    Message: "succefully LoggedIN",
    token,
    id,
  });
};

exports.GetAllUsers = async (req, res, next) => {
  let UsersList;

  try {
    UsersList = await authModal.find({}, "-password");
  } catch (error) {
    return next(ErrorHandler("Something went Wrong", "error", 404));
  }

  res.status(201).json({ UsersList });
};

exports.GetCurrentUser = async (req, res, next) => {
  let User;
  try {
    User = await authModal.findById(req.params.id, "-password");
    // console.log(req.params.id, User.questionsPerDay);
  } catch (error) {
    return next(ErrorHandler("User Not Exists", "error", 404));
  }

  res.status(200).json({ User });
};

exports.EditUser = async (req, res, next) => {
  let EditUser;

  try {
    EditUser = await authModal.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      about: req.body.about,
      tags: req.body.tags,
    });
  } catch (error) {
    return next(ErrorHandler("Fail To Update", "error", 202));
  }

  await EditUser.save();

  res.status(200).json({ data: req.body, message: "Udate Success" });
};

exports.Subscription = async (req, res, next) => {
  let UserSubscription;

  try {
    UserSubscription = await authModal.findByIdAndUpdate(req.params.id, {
      subscription: {
        SubscribedOn: req.body.SubscribedOn,
        subscriptionType: req.body.subscriptionType,
        Time: 24,
        questionLimit: req.body.questionLimit,
      },
    });
  } catch (error) {
    return next(ErrorHandler("Fail To Update", "error", 202));
  }
  await UserSubscription.save();
  res.status(200).json({ data: req.body, message: "Udate Success" });
};

exports.ResetTimer = async (req, res, next) => {
  try {
    await authModal.findByIdAndUpdate(req.params.id, {
      questionsPerDay: 0,
      questionAskDate: req.params.body,
    });
  } catch (error) {
    return next(ErrorHandler("Something went wrong", "error", 202));
  }
  res.status(200).json({ data: req.body, message: "Udate Success" });
};

exports.Payment = async (req, res, next) => {
  const calculateOrderAmount = (items) => {
    return items;
  };
  const { items } = req.body;
  console.log(req.body);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items[0].amount ? items[0].amount : 100),
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  // console.log(paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};

exports.AddFriends = async (req, res, next) => {
  let friends = [];
  try {
    const user = await authModal.findById(req.params.id);
    friends = user.friends;
    if (friends.map((e) => e === req.body.friendsId)[0]) {
      return res
        .status(201)
        .json({ message: "Already Friends", Status: "Friend" });
    }
    friends.push(req.body.friendsId);

    await authModal.findByIdAndUpdate(req.params.id, {
      friends: friends,
    });
  } catch (error) {
    ErrorHandler("Cannot Add Friend", "error", 404);
  }

  res.status(201).json({ message: "success", friends });
};

exports.RemoveFriends = async (req, res, next) => {
  let friends;
  let friendsList;
  try {
    const user = await authModal.findById(req.params.id);
    friends = user.friends;

    friendsList = friends.filter((friend) => friend !== req.body.friendsId);
    await authModal.findByIdAndUpdate(req.params.id, {
      friends: friendsList,
    });
  } catch (error) {
    ErrorHandler("Cannot Remove Friend", "error", 404);
  }
  res.status(201).json({ message: "success", friendsList });
};
