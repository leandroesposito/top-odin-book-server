const controller = require("../controllers/post");
const router = require("express").Router({ mergeParams: true });
const likeRouter = require("./like");

router.get("/feed", controller.getFeedPosts);
router.get("/:postId", controller.getPostById);
router.get("/", controller.getAllPosts);
router.post("/", controller.createPost);
router.use("/:postId/like", likeRouter);
router.put("/:postId", controller.updatePost);
router.delete("/:postId", controller.deletePost);

module.exports = router;
