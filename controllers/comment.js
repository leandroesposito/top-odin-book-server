const commentDB = require("../db/comment");
const validator = require("./validators");

const createComment = [
  validator.isAuthenticated(),
  validator.postExist(),
  validator.validateBodyStringLength("body", 1, 250),
  validator.checkValidations(),
  async function (req, res) {
    const result = await commentDB.createComment(
      req.user.id,
      req.locals.post.id,
      req.body.body,
    );

    if (result) {
      res.json({ success: true, mesage: "Comment create successfully." });
    } else {
      throw new Error("Error creating the comment.");
    }
  },
];

const getPostComments = [
  validator.postExist(),
  validator.checkValidations(),
  async function (req, res) {
    const comments = await commentDB.getPostComments(req.params.postId);

    res.json({ success: true, comments });
  },
];

const deleteComment = [
  validator.isAuthenticated(),
  validator.commentBelongToUser(),
  validator.checkValidations(),
  async function (req, res) {
    const id = await commentDB.deleteComment(req.params.commentId);

    if (!id) {
      throw new Error("Error deleting comment.");
    }

    res.json({ success: true, message: "Comment deleted successfully." });
  },
];

module.exports = {
  createComment,
  getPostComments,
  deleteComment,
};
