const postsController = require("../controllers/post");
const searchController = require("../controllers/search");
const postsRouter = require("./post");
const friendRequestRouter = require("./friend-request");
const router = require("express").Router();

router.get("/search/:searchParam", searchController.searchUser);
router.use("/", friendRequestRouter);
router.use("/:userId/posts", postsRouter);

module.exports = router;
