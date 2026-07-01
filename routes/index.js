const { Router } = require("express");
const authRouter = require("./auth");
const indexController = require("../controllers/index");

const indexRouter = Router();

indexRouter.use("/auth", authRouter);
indexRouter.get("/", indexController.index);

module.exports = indexRouter;
