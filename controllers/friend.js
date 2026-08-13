const { body } = require("express-validator");
const friendDB = require("../db/friend");
const validator = require("./validators");

const getMyFriendsList = [
  validator.isAuthenticated(),
  async function (req, res) {
    const friends = await friendDB.getFriendsList(req.user.id, req.user.id);
    const suggestedUsers = await friendDB.getNRandomSuggestedUsers(
      req.user.id,
      5,
    );

    res.json({ success: true, friends, suggestedUsers, user: req.user });
  },
];

const getFriendsList = [
  validator.userExist(),
  validator.checkValidations(),
  async function (req, res) {
    const friends = await friendDB.getFriendsList(
      req.params.userId,
      req.user?.id,
    );

    res.json({ success: true, friends, user: req.locals.user });
  },
];

const deleteFriend = [
  validator.isAuthenticated(),
  validator.userExist(),
  validator.isFriend(),
  validator.checkValidations(),
  async function (req, res) {
    const friends = await friendDB.deleteFriendsPair(
      req.user.id,
      req.params.userId,
    );

    res.json({ success: true, message: "Friend deleted." });
  },
];

const getFriendsSuggestions = [
  validator.isAuthenticated(),
  async function (req, res) {
    const suggestedUsers = await friendDB.getSuggestedUsers(req.user.id);

    res.json({ success: true, suggestedUsers });
  },
];

module.exports = {
  getMyFriendsList,
  getFriendsList,
  getFriendsSuggestions,
  deleteFriend,
};
