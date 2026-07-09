const { Router } = require("express");
const authRouter = require("./auth");
const profileRouter = require("./profile");
const postRouter = require("./post");
const userRouter = require("./user");
const indexController = require("../controllers/index");

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/profiles", profileRouter);
indexRouter.use("/posts", postRouter);
indexRouter.use("/users", userRouter);
indexRouter.get("/", indexController.index);

module.exports = indexRouter;
