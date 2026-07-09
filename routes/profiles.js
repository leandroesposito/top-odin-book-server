const controller = require("../controllers/profile");
const router = require("express").Router();

router.get("/:userId", controller.getProfileByUserId);
router.post("/", controller.createProfile);
router.put("/", controller.updateProfile);

module.exports = router;
