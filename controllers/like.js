const likeDB = require("../db/like");
const validator = require("./validators");

const addLike = [
  validator.isAuthenticated(),
  validator.postExist(),
  validator.userHasntLikedPost(),
  validator.checkValidations(),
  async function (req, res) {
    const result = await likeDB.addLike(req.user.id, req.locals.post.id);

    if (result) {
      res.json({ success: true });
    } else {
      throw new Error("Error liking the post.");
    }
  },
];

const removeLike = [
  validator.isAuthenticated(),
  validator.postExist(),
  validator.userLikesPost(),
  validator.checkValidations(),
  async function (req, res) {
    const result = await likeDB.removeLike(req.user.id, req.locals.post.id);

    if (result) {
      res.json({ success: true });
    } else {
      throw new Error("Error removing like from the post.");
    }
  },
];

module.exports = {
  addLike,
  removeLike,
};
