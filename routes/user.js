const postsController = require("../controllers/post");
const postsRouter = require("./post");
const friendRequestRouter = require("./friend-request");
const router = require("express").Router();

router.use("/", friendRequestRouter);
router.use("/:userId/posts", postsRouter);

module.exports = router;
