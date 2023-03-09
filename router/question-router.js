const express = require("express");
const {
  Askquestion,
  DeleteQuestion,
  GetAllQuestions,
  AnswerQuestion,
  DeleteAnswer,
  GetQuestion,
  UpVotes,
  DownVotes,
} = require("../controller/question-controll");
const router = express.Router();

//question
router.post("/Askquestion", Askquestion);
router.delete("/:id", DeleteQuestion);
router.get("/GetAllQuestions", GetAllQuestions);
router.get("/Question/:id", GetQuestion);
router.patch("/Question/upvotes/:id/", UpVotes);
router.patch("/Question/downvotes/:id/", DownVotes);

//Answers
router.patch("/answer/:id", AnswerQuestion);
router.patch("/deleteAnswer/:id", DeleteAnswer);

module.exports = router;
