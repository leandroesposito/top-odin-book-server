const controller = require("../controllers/notification");
const router = require("express").Router();

router.get("/", controller.getNotifications);

module.exports = router;
