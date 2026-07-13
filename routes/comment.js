const controller = require("../controllers/comment");
const router = require("express").Router({ mergeParams: true });

router.delete("/:commentId", controller.deleteComment);
router.post("/", controller.createComment);
router.get("/", controller.getPostComments);

module.exports = router;
