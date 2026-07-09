const controller = require("../controllers/post");
const router = require("express").Router({ mergeParams: true });

router.get("/:postId", controller.getPostById);
router.get("/", controller.getPosts);
router.post("/", controller.createPost);
router.put("/:postId", controller.updatePost);
router.delete("/:postId", controller.deletePost);

module.exports = router;
