const bcrypt = require("bcryptjs");
const validator = require("./validators");
const userDB = require("../db/user");
const profileDB = require("../db/profile");

const signUp = [
  validator.validateUsername(),
  validator.validatePassword(),
  validator.validateConfirmPassword(),
  validator.checkValidations(),
  async function (req, res) {
    const { username, password } = req.body;

    const securePassword = bcrypt.hashSync(password, 10);

    const newUserId = await userDB.createUser(username, securePassword);
    const newProfileId = await profileDB.createProfile({}, newUserId.id);

    if (newUserId) {
      res.json({ success: true, message: "User created successfully." });
    } else {
      throw new Error("error creating user.");
    }
  },
];

module.exports = { signUp };
