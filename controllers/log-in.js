const validator = require("./validators");
const passport = require("passport");
const userDB = require("../db/user");

const logIn = [
  validator.validateBodyString("username"),
  validator.validateBodyString("password"),
  validator.checkValidations(),
  function (req, res, next) {
    passport.authenticate(
      "local",
      {
        failureMessage: true,
      },
      (error, user, info) => {
        if (error) {
          return next(error);
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            errors: [info?.message],
          });
        }

        req.login(user, next);
      },
    )(req, res, next);
  },
  function (req, res) {
    if (req.user) {
      res.json({
        success: true,
        user: req.user,
        message: `Welcome back ${req.user.name}.`,
      });
    }
  },
];

const resetGuestUser = [
  async function (req, res, next) {
    const guestUserCred = {
      username: "guest_user",
      password: "pguser",
    };

    const guestUserId = await userDB.resetGuestUser();
    await userDB.createGuestData(guestUserId);
    const guestUser = await userDB.getUserByUsername(guestUserCred.username);

    req.logIn(guestUser, (err) => {
      if (err) {
        next(err);
      }

      res.json({ success: true, message: "Welcome guest.", user: req.user });
    });
  },
];

module.exports = { logIn, resetGuestUser };
