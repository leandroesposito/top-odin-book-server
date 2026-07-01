const validator = require("./validators");

const logOut = [
  validator.isAuthenticated(),
  function (req, res, next) {
    req.logout((error) => {
      if (error) {
        return next(error);
      }
    });
    res.json({ success: true });
  },
];

module.exports = {
  logOut,
};
