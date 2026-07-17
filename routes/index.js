const { Router } = require("express");
const authRouter = require("./auth");
const profileRouter = require("./profile");
const postRouter = require("./post");
const userRouter = require("./user");
const friendRouter = require("./friend");
const messageRouter = require("./message");
const indexController = require("../controllers/index");

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/profiles", profileRouter);
indexRouter.use("/posts", postRouter);
indexRouter.use("/users", userRouter);
indexRouter.use("/friends", friendRouter);
indexRouter.use("/messages", messageRouter);
indexRouter.get("/", indexController.index);

module.exports = indexRouter;
