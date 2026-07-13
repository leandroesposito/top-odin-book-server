const controller = require("../controllers/friend-request");
const router = require("express").Router({ mergeParams: true });

router.get("/me/friends-requests", controller.getFriendsRequest);
router.post("/:userId/send-request", controller.createFriendRequest);
router.post("/:userId/accept-request", controller.acceptFriendRequest);
router.delete("/:userId/reject-request", controller.rejectFriendRequest);

module.exports = router;
