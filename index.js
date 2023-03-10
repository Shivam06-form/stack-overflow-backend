const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const UserAuth = require("./router/auth-router");
const QuestionRouter = require("./router/question-router");
const SocialRouter = require("./router/social-router");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const { ErrorHandler } = require("./middleware/ErrorHandler");
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();
mongoose.set("strictQuery", true);

// app.use("/uploads/images", express.static(path.join("uploads", "images")));
// app.use("/uploads/videos", express.static(path.join("uploads", "videos")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type , Accept, Authorization"
  );

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

//LOGIN
app.use("/api/user", UserAuth);
app.use("/api/question", QuestionRouter);
app.use("/api/social", SocialRouter);

app.use("*", (req, res, next) => {
  return next(ErrorHandler(`Cannot GET ${req.originalUrl}`, "fail", 500));
});

// For Handling Error's
app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const DB = process.env.DB_URI;
const PORT = process.env.PORT||4000

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() =>
    app.listen(PORT, () => {
      console.log(`App running on Port ${PORT}...`);
    })
  )
  .catch((error) => console.log(error));
