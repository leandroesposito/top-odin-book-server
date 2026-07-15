const controller = require("../controllers/friend");
const router = require("express").Router();

router.get("/", controller.getMyFriendsList);
router.get("/:userId", controller.getFriendsList);
router.delete("/:userId", controller.deleteFriend);

module.exports = router;
