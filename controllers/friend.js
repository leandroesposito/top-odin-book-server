const { body } = require("express-validator");
const friendDB = require("../db/friend");
const validator = require("./validators");

const getMyFriendsList = [
  validator.isAuthenticated(),
  async function (req, res) {
    const friends = await friendDB.getFriendsList(req.user.id, req.user.id);
    const notFriends = await friendDB.getNotFriendsRandomList(req.user.id, 5);

    res.json({ success: true, friends, notFriends, user: req.user });
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

module.exports = {
  getMyFriendsList,
  getFriendsList,
  deleteFriend,
};
