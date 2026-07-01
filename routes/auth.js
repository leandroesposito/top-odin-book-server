const { Router } = require("express");
const logInRouter = require("./log-in");
const logOutRouter = require("./log-out");
const signUpRouter = require("./sign-up");

const authRouter = Router();

authRouter.use("/sign-up", signUpRouter);
authRouter.use("/log-in", logInRouter);
authRouter.use("/log-out", logOutRouter);

module.exports = authRouter;
