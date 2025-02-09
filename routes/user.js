const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware");
const usersController = require("../controllers/users.js")


router.route("/signup")
.get( usersController.renderSignup)
.post(wrapAsync(usersController.signup));



router.route("/login")
.get( usersController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true
        }),
    usersController.login);


router.get("/logout", usersController.loggedOut);

module.exports = router;
