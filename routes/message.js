const controller = require("../controllers/message");
const router = require("express").Router();

router.post("/user/:userId", controller.sendMessage);
router.get("/user/:userId", controller.getChat);
router.get("/", controller.getChats);
router.delete("/:messageId", controller.deleteMessage);

module.exports = router;
