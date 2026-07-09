const { body } = require("express-validator");
const postDB = require("../db/post");
const validator = require("./validators");

const validatePostBody = () =>
  validator.validateBodyStringLength("body", 1, 500);

const createPost = [
  validator.isAuthenticated(),
  validatePostBody(),
  validator.checkValidations(),
  async function (req, res) {
    const { body } = req.body;
    const id = await postDB.createPost(body, req.user.id);

    if (!id) {
      throw new Error("Error creating post.");
    }

    res.json({ success: true, mesage: "Post create successfully." });
  },
];

const getPostById = [
  validator.postExist(),
  validator.checkValidations(),
  async function (req, res) {
    const post = await postDB.getPostById(req.params.postId);

    res.json({ success: true, post });
  },
];

const getPosts = [
  async function (req, res) {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let posts = [];

    if (userId) {
      posts = await postDB.getPostsByUserId(userId);
    } else {
      posts = await postDB.getAllPosts(limit, offset);
    }

    res.json({ success: true, posts, page, limit });
  },
];

const updatePost = [
  validator.isAuthenticated(),
  validator.postBelongToUser(),
  validatePostBody(),
  validator.checkValidations(),
  async function (req, res) {
    const { body } = req.body;
    const id = await postDB.updatePost(body, req.params.postId);

    if (!id) {
      throw new Error("Error updating post.");
    }

    res.json({ success: true, mesage: "Post updated successfully." });
  },
];

const deletePost = [
  validator.isAuthenticated(),
  validator.postBelongToUser(),
  validator.checkValidations(),
  async function (req, res) {
    const id = await postDB.deletePost(req.params.postId);

    if (!id) {
      throw new Error("Error deleting post.");
    }

    res.json({ success: true, mesage: "Post deleted successfully." });
  },
];

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
