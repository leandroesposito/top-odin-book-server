const { Router } = require("express");
const logInController = require("../controllers/log-in");

const logInRouter = Router();

logInRouter.post("/", logInController.logIn);
logInRouter.post("/guest", logInController.resetGuestUser);

module.exports = logInRouter;
