const postsController = require("../controllers/post");
const postsRouter = require("./post");
const router = require("express").Router();

router.use("/:userId/posts", postsRouter);

module.exports = router;
