const { body, validationResult } = require("express-validator");
const InvalidArgumentError = require("../errors/InvalidArgumentError");
const NotAuthorizedError = require("../errors/NotAuthorizedError");
const userDB = require("../db/user");

function checkValidations() {
  return function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.locals = { errors: errors.array().map((e) => e.msg) };
      return next(new InvalidArgumentError());
    }
    next();
  };
}

function isAuthenticated() {
  return function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next(new NotAuthorizedError("You must log in to continue."));
    }
    next();
  };
}

function validateBodyString(field) {
  return body(field)
    .trim()
    .notEmpty()
    .withMessage(`'${field}' field is required`);
}

function validateUsername() {
  return body("username")
    .isString()
    .isLength({ min: 8, max: 20 })
    .withMessage("'username' must be between 8 and 20 characters.")
    .custom((username) => {
      const pattern = /(?=.*[^a-z0-9_.])/;
      if (pattern.test(username)) {
        throw new InvalidArgumentError(
          "'username' can only have lowercase letters, numbers, dots (.) and underscores (_)",
        );
      }
      return true;
    })
    .custom(async (username) => {
      const user = await userDB.getUserByUsername(username);
      if (user) {
        throw new InvalidArgumentError(
          `'username' ${username} already in use.`,
        );
      }
      return true;
    });
}

function validatePassword() {
  return body("password").custom((password) => {
    const pattern = RegExp(
      /(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[^a-zA-Z0-9]).{8}/,
    );
    if (!pattern.test(password)) {
      throw new InvalidArgumentError(
        "'password' must contain: at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol.",
      );
    }
    return true;
  });
}

function validateConfirmPassword() {
  return body("confirm-password").custom((confirmPassword, { req }) => {
    if (!req.body || confirmPassword !== req.body.password) {
      throw new InvalidArgumentError(
        "'password' must be equal to 'confirm-password'.",
      );
    }
    return true;
  });
}

module.exports = {
  checkValidations,
  isAuthenticated,
  validateBodyString,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
};
