const validator = require("./validators");
const passport = require("passport");

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
      res.json({ success: true, user: req.user });
    }
  },
];

module.exports = { logIn };
