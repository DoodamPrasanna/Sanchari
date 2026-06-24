const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require('../middlewares.js');
const userController = require('../controllers/users.js');

router.route("/signup").get(userController.getSignup)
    .post(wrapAsync(userController.postSignup));

router.route("/login").get(userController.getLogin)
    .post(saveRedirectUrl, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), userController.postLogin);

   router.get("/logout", userController.logout);

module.exports = router;

// router.get("/signup", userController.getSignup);

// router.post("/signup", wrapAsync( userController.postSignup));

// router.get("/login", userController.getLogin);

// router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), userController.postLogin);

