const controller = require("../controllers/post");
const router = require("express").Router({ mergeParams: true });

router.get("/feed", controller.getFeedPosts);
router.get("/:postId", controller.getPostById);
router.get("/", controller.getAllPosts);
router.post("/", controller.createPost);
router.put("/:postId", controller.updatePost);
router.delete("/:postId", controller.deletePost);

module.exports = router;
