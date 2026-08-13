const { param } = require("express-validator");
const userDB = require("../db/user");
const { checkValidations } = require("./validators");

const searchUser = [
  param("searchParam")
    .trim()
    .isLength({ min: 3 })
    .withMessage("search parameter must be at least 3 characters."),
  checkValidations(),
  async function (req, res) {
    const { searchParam } = req.params;
    const foundUsers = await userDB.searchUsers(searchParam, req.user?.id);

    res.json({ success: true, foundUsers });
  },
];

module.exports = { searchUser };
