const { body } = require("express-validator");
const friendRequestDB = require("../db/friend-request");
const friendDB = require("../db/friend");
const validator = require("./validators");

const createFriendRequest = [
  validator.isAuthenticated(),
  validator.userExist(),
  validator.friendRequestIsValid(),
  validator.checkValidations(),
  async function (req, res) {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    const result = await friendRequestDB.createFriendRequest(
      senderId,
      receiverId,
    );

    if (!result) {
      throw new Error("Error sending friend request.");
    }

    res.json({ success: true, message: "Friend request sent." });
  },
];

const getFriendsRequest = [
  validator.isAuthenticated(),
  async function (req, res) {
    const requests = await friendRequestDB.getAllFriendsRequests(req.user.id);

    const received = [];
    const sent = [];

    for (const r of requests) {
      if (r.sender_id === req.user.id) {
        sent.push({
          id: r.id,
          name: r.name,
          profile_picture_url: r.profile_picture_url,
        });
      } else {
        received.push({
          id: r.id,
          name: r.name,
          profile_picture_url: r.profile_picture_url,
        });
      }
    }

    res.json({ success: true, sent, received });
  },
];

const acceptFriendRequest = [
  validator.isAuthenticated(),
  validator.friendRequestReceived(),
  validator.checkValidations(),
  async function (req, res) {
    const senderId = req.params.userId;
    const receiverId = req.user.id;

    const accepted = await friendDB.addFriendsPair(receiverId, senderId);

    if (!accepted) {
      throw new Error("Error accepting friend request.");
    }

    await friendRequestDB.deleteFriendRequest(senderId, receiverId);

    res.json({ success: true, message: "Friend request accepted." });
  },
];

const rejectFriendRequest = [
  validator.isAuthenticated(),
  validator.friendRequestReceived(),
  validator.checkValidations(),
  async function (req, res) {
    const senderId = req.params.userId;
    const receiverId = req.user.id;

    const result = friendRequestDB.deleteFriendRequest(senderId, receiverId);

    if (!result) {
      throw new Error("Error rejecting friend request.");
    }

    res.json({ success: true, message: "Friend request rejected." });
  },
];

const cancelFriendRequest = [
  validator.isAuthenticated(),
  validator.friendRequestSended(),
  validator.checkValidations(),
  async function (req, res) {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    const result = friendRequestDB.deleteFriendRequest(senderId, receiverId);

    if (!result) {
      throw new Error("Error canceling friend request.");
    }

    res.json({ success: true, message: "Friend request canceled." });
  },
];

module.exports = {
  createFriendRequest,
  getFriendsRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
};
