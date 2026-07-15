const { body } = require("express-validator");
const friendDB = require("../db/friend");
const validator = require("./validators");

const getMyFriendsList = [
  validator.isAuthenticated(),
  async function (req, res) {
    const friends = await friendDB.getFriendsList(req.user.id);

    res.json({ succes: true, friends });
  },
];

const getFriendsList = [
  validator.isAuthenticated(),
  validator.userExist(),
  async function (req, res) {
    const friends = await friendDB.getFriendsList(req.params.userId);

    res.json({ succes: true, friends });
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

    res.json({ succes: true });
  },
];

module.exports = {
  getMyFriendsList,
  getFriendsList,
  deleteFriend,
};
