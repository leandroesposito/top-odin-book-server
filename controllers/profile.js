require("dotenv").config();
const { body } = require("express-validator");
const profileDB = require("../db/profile");
const validator = require("./validators");
const cloudinary = require("cloudinary").v2;

const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 512,
    files: 1,
  },
  fileFilter: function (req, file, cb) {
    cb(null, true);
  },
}).single("profile-picture");

cloudinary.config();

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
  upload,
  async function (req, res) {
    const body = { ...req.body };

    if (req.file) {
      const filePublicId = `profile_picture_${req.user.id}`;
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: filePublicId,
              overwrite: true,
              format: "jpg",
            },
            (error, uploadResult) => {
              if (error) {
                return reject(error);
              }
              return resolve(uploadResult);
            },
          )
          .end(req.file.buffer);
      });

      body.profilePictureUrl = uploadResult.url;
    }

    const id = await profileDB.updateProfile(body, req.user.id);

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
