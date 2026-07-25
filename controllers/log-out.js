const validator = require("./validators");

const logOut = [
  validator.isAuthenticated(),
  function (req, res, next) {
    req.logout((error) => {
      if (error) {
        return next(error);
      }

      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ success: true });
      });
    });
  },
];

module.exports = {
  logOut,
};
