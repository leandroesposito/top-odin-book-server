const { Router } = require("express");
const authRouter = require("./auth");
const profileRouter = require("./profile");
const indexController = require("../controllers/index");

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/profiles", profileRouter);
indexRouter.get("/", indexController.index);

module.exports = indexRouter;
