const controller = require("../controllers/like");
const router = require("express").Router({ mergeParams: true });

router.post("/", controller.addLike);
router.delete("/", controller.removeLike);

module.exports = router;
