const controller = require("../controllers/post");
const router = require("express").Router({ mergeParams: true });
const likeRouter = require("./like");
const commentRouter = require("./comment");

router.get("/feed", controller.getFeedPosts);
router.get("/", controller.getAllPosts);
router.post("/", controller.createPost);

router.get("/:postId", controller.getPostById);
router.put("/:postId", controller.updatePost);
router.delete("/:postId", controller.deletePost);

router.use("/:postId/like", likeRouter);
router.use("/:postId/comments", commentRouter);

module.exports = router;
