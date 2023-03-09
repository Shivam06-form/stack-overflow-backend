const questionModal = require("../modal/questionModal");
const { ErrorHandler } = require("../middleware/ErrorHandler");
const authModal = require("../modal/authModal");

//QUESTIONS
exports.Askquestion = async (req, res, next) => {
  const { questionTitle, questionBody, questionTags, userPosted, userId } =
    req.body;
  let newQuestion;

  try {
    newQuestion = new questionModal({
      questionTitle,
      questionBody,
      questionTags,
      userPosted,
      userId,
    });

    await newQuestion.save();
  } catch (error) {
    return next(ErrorHandler("Fail to Post , Please try Again", "error", 409));
  }

  try {
    User = await authModal.findById(userId, "-password");
    console.log(User.questionsPerDay);
    await authModal.findByIdAndUpdate(userId, {
      questionsPerDay: User.questionsPerDay + 1,
      questionAskDate: Date.now(),
    });
  } catch (error) {
    return next(ErrorHandler("Fail to Post , Please try Again", "error", 409));
  }

  res.status(200).json({ message: "success", Qns: req.body });
};

exports.GetAllQuestions = async (req, res, next) => {
  let questionList;

  try {
    questionList = await questionModal.find({});
  } catch (error) {
    return next(ErrorHandler("Something went Wrong", "error", 404));
  }
  res.status(200).json({
    questionList,
  });
};

exports.GetQuestion = async (req, res, next) => {
  let question;
  try {
    question = await questionModal.findById(req.params.id);
  } catch (error) {
    return next(ErrorHandler("Something went Wrong", "error", 404));
  }
  res.status(200).json({
    question,
  });
};

exports.DeleteQuestion = async (req, res, next) => {
  try {
    await questionModal.deleteOne({ id: req.params.id });
  } catch (error) {
    return next(
      ErrorHandler("Fail to Delete , Please try Again", "error", 409)
    );
  }

  res.status(202).json({
    Message: "Delete Success",
  });
};

//Answer's
exports.AnswerQuestion = async (req, res, next) => {
  const { answerBody, userAnswered, userId } = req.body;

  const getQuestion = await questionModal.findById(req.params.id);

  let answersList = getQuestion.answer;

  let question;
  try {
    answersList = answersList.concat({
      answerBody,
      userAnswered,
      userId,
      answeredOn: new Date(Date.now()),
    });

    question = await questionModal.findByIdAndUpdate(req.params.id, {
      answer: answersList,
      noOfAnswers: +answersList.length === 0 ? 0 : +answersList.length,
    });
  } catch (error) {
    return next(
      ErrorHandler("Unable to Answer, Please try Again", "error", 409)
    );
  }
  res.status(200).json({ message: "Answer Success", answersList });
};

exports.DeleteAnswer = async (req, res, next) => {
  let getAnswers;
  let AnswersList = [];

  try {
    getAnswers = await questionModal.findById(req.params.id);
    getAnswers.answer.filter((d) => {
      AnswersList.push(d);
    });

    const Answer = AnswersList.find(
      (d) => d._id.toString() !== req.body.Answerid
    );

    if (Answer !== undefined) {
      await questionModal.findByIdAndUpdate(req.params.id, {
        answer: Answer,
        noOfAnswers: +AnswersList.length - 1,
      });
    } else {
      await questionModal.findByIdAndUpdate(req.params.id, {
        answer: [],
        noOfAnswers: 0,
      });
    }
  } catch (error) {
    return next(
      ErrorHandler(
        "Something Went Wrong cannot Delete Answer ,Try Again",
        "error",
        409
      )
    );
  }
  res.status(202).json({
    message: "Answer DELETED",
    // answer: AnswersList === undefined ? [] : AnswersList,
  });
};

//Votes

exports.UpVotes = async (req, res, next) => {
  let question;
  let votes = [];

  try {
    question = await questionModal.findById(req.params.id);
    const addvote = question.upVote.filter((d) => d !== req.body.userId);
    const upvote = question.upVote.map((d) => d === req.body.userId);
    const filterTrue = upvote.filter((d) => d === true);

    if (filterTrue[0] === true) {
      votes = addvote;
    } else {
      votes = question.upVote;
      votes = votes.concat(req.body.userId);
    }
    question = await questionModal.findByIdAndUpdate(req.params.id, {
      upVote: votes,
    });
  } catch (error) {
    return next(
      ErrorHandler(
        "Something Went Wrong cannot cannot vote ,Try Again",
        "error",
        409
      )
    );
  }

  res.status(200).json({ message: "voting", question, votes });
};

exports.DownVotes = async (req, res, next) => {
  let question;
  let votes = [];

  try {
    question = await questionModal.findById(req.params.id);
    const addVote = question.downVote.filter((d) => d !== req.body.userId);
    const downvote = question.downVote.map((d) => d === req.body.userId);
    const filterTrue = downvote.filter((d) => d === true);

    if (filterTrue[0] === true) {
      votes = addVote;
    } else {
      votes = question.downVote;
      votes = votes.concat(req.body.userId);
    }

    question = await questionModal.findByIdAndUpdate(req.params.id, {
      downVote: votes,
      // downVote: [],
    });
  } catch (error) {
    return next(
      ErrorHandler(
        "Something Went Wrong cannot cannot vote ,Try Again",
        "error",
        409
      )
    );
  }

  res.status(200).json({ message: "voting", question, votes });
};
