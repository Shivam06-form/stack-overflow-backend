const {
  AuthSignup,
  AuthLogin,
  GetAllUsers,
  GetCurrentUser,
  EditUser,
  Subscription,
  ResetTimer,
  Payment,
  AddFriends,
  RemoveFriends,
} = require("../controller/auth-controller");
const express = require("express");
const router = express.Router();

// user
router.post("/signup", AuthSignup);
router.post("/login", AuthLogin);
router.get("/GetAllUsers", GetAllUsers);
router.get("/:id", GetCurrentUser);
router.patch("/edit/:id", EditUser);
router.patch("/subscription/:id", Subscription);
router.patch("/resetTimer/:id", ResetTimer);
router.post("/create-payment-intent", Payment);
router.post("/addfriends/:id", AddFriends);
router.post("/removefriends/:id", RemoveFriends);

module.exports = router;
