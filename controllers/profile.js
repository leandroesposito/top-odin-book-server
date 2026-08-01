const { body } = require("express-validator");
const profileDB = require("../db/profile");
const validator = require("./validators");

const validateProfileFields = [
  validator
    .validateBodyStringLength("name", 0, 50)
    .optional({ values: "falsy" }),
  body("birthdate").isDate().optional({ values: "falsy" }),
  validator
    .validateBodyStringLength("bio", 0, 200)
    .optional({ values: "falsy" }),
  validator
    .validateBodyStringLength("profession", 0, 20)
    .optional({ values: "falsy" }),
  validator
    .validateBodyStringLength("profile_picture_url", 0, 255)
    .optional({ values: "falsy" }),
];

const createProfile = [
  validator.isAuthenticated(),
  validator.userDoesntHaveProfile(),
  validateProfileFields,
  validator.checkValidations(),
  async function (req, res) {
    const id = await profileDB.createProfile(req.body, req.user.id);

    if (!id) {
      throw new Error("Error creating profile.");
    }

    res.json({ success: true, message: "Profile create successfully." });
  },
];

const updateProfile = [
  validator.isAuthenticated(),
  validator.userHasProfile(),
  validateProfileFields,
  validator.checkValidations(),
  async function (req, res) {
    const id = await profileDB.updateProfile(req.body, req.user.id);

    if (!id) {
      throw new Error("Error updating profile.");
    }

    res.json({ success: true, message: "Profile updated successfully." });
  },
];

const getProfileByUserId = [
  validator.profileExist(),
  validator.checkValidations(),
  function (req, res) {
    res.json({
      profile: {
        id: req.locals.profile.id,
        name: req.locals.profile.name,
        bio: req.locals.profile.bio,
        birthdate: req.locals.profile.birthdate,
        profession: req.locals.profile.profession,
        profilePictureUrl: req.locals.profile.profile_picture_url,
        userId: req.locals.profile.user_id,
        friendsCount: req.locals.profile.friends_count,
      },
    });
  },
];

module.exports = {
  createProfile,
  updateProfile,
  getProfileByUserId,
};
