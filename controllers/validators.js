const { body, validationResult, param } = require("express-validator");
const InvalidArgumentError = require("../errors/InvalidArgumentError");
const NotAuthorizedError = require("../errors/NotAuthorizedError");
const NotFoundError = require("../errors/NotFoundError");
const userDB = require("../db/user");
const profileDB = require("../db/profile");
const postDB = require("../db/post");
const likeDB = require("../db/like");

function checkValidations() {
  return function (req, res, next) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = [];

      for (const err of result.errors) {
        if (Object.hasOwn(err.msg, "error")) {
          return next(err.msg.error);
        }

        errors.push(err.msg);
      }

      req.locals = { errors };
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

function validateBodyStringLength(field, min, max) {
  return body(field)
    .isString()
    .trim()
    .isLength({ min, max })
    .withMessage(
      `'${field}' must be between ${min} and ${max} characters inclusive.`,
    );
}

function validateUsername() {
  return validateBodyStringLength("username", 4, 20)
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

function userDoesntHaveProfile() {
  return body().custom(async (_, { req }) => {
    const profile = await profileDB.getProfileByUserId(req.user.id);

    if (profile) {
      throw new InvalidArgumentError(
        "You already have a profile, use edit function to update it.",
      );
    }

    return true;
  });
}

function userHasProfile() {
  return body().custom(async (_, { req }) => {
    const profile = await profileDB.getProfileByUserId(req.user.id);

    if (!profile) {
      throw new InvalidArgumentError(
        "You don't have a profile, use create function to create one.",
      );
    }

    return true;
  });
}

function profileExist() {
  return param("userId").custom(async (userId, { req }) => {
    const profile = await profileDB.getProfileByUserId(userId);

    if (!profile) {
      throw { error: new NotFoundError("Profile not found.") };
    }

    req.locals = { profile };

    return true;
  });
}

function postExist() {
  return param("postId").custom(async (postId, { req }) => {
    const post = await postDB.getPostById(postId);

    if (!post) {
      throw { error: new NotFoundError("Post not found.") };
    }

    req.locals = { post };

    return true;
  });
}

function postBelongToUser() {
  return param("postId").custom(async (postId, { req }) => {
    const post = await postDB.getPostById(postId);

    if (!post) {
      throw { error: new NotFoundError("Post not found.") };
    }

    if (post.user_id !== req.user.id) {
      throw { error: new NotAuthorizedError() };
    }

    req.locals = { post };

    return true;
  });
}

function userLikesPost() {
  return param("postId").custom(async (postId, { req }) => {
    const like = await likeDB.postIsLiked(req.user.id, req.locals.post.id);

    if (!like) {
      throw new InvalidArgumentError("You have not liked the post yet.");
    }

    return true;
  });
}

function userHasntLikedPost() {
  return param("postId").custom(async (postId, { req }) => {
    const like = await likeDB.postIsLiked(req.user.id, req.locals.post.id);

    if (like) {
      throw new InvalidArgumentError("You already like this post.");
    }

    return true;
  });
}

module.exports = {
  checkValidations,
  isAuthenticated,
  validateBodyString,
  validateBodyStringLength,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  userDoesntHaveProfile,
  userHasProfile,
  profileExist,
  postExist,
  postBelongToUser,
  userLikesPost,
  userHasntLikedPost,
};
