const { Router } = require("express");
const logInRouter = require("./log-in");
const logOutRouter = require("./log-out");
const signUpRouter = require("./sign-up");
const accountController = require("../controllers/account");

const authRouter = Router();

authRouter.use("/sign-up", signUpRouter);
authRouter.use("/log-in", logInRouter);
authRouter.use("/log-out", logOutRouter);
authRouter.delete("/account", accountController.deleteAccount);

module.exports = authRouter;
