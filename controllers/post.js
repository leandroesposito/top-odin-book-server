const { body } = require("express-validator");
const postDB = require("../db/post");
const pictureDB = require("../db/picture");
const validator = require("./validators");
const cloudinary = require("cloudinary").v2;

const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 512,
  },
  fileFilter: function (req, file, cb) {
    cb(null, true);
  },
}).array("pictures");

cloudinary.config();

const validatePostBody = () =>
  validator.validateBodyStringLength("body", 1, 500);

const uploadPicture = async (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          format: "jpg",
        },
        (error, uploadResult) => {
          if (error) {
            return reject(error);
          }
          return resolve(uploadResult);
        },
      )
      .end(buffer);
  });
};

const uploadPictures = async (postId, files) => {
  for (const file of files) {
    const uploadResult = await uploadPicture(file.buffer);

    await pictureDB.uploadPostPicture(
      postId,
      uploadResult.url,
      uploadResult.public_id,
    );
  }
};

const addPostsPictures = async (posts) => {
  for (const post of posts) {
    const pictures = await pictureDB.getPostPictures(post.id);

    if (pictures.length > 0) {
      post.pictures = pictures;
    }
  }
};

const createPost = [
  upload,
  validator.isAuthenticated(),
  validatePostBody(),
  validator.checkValidations(),
  async function (req, res) {
    const { body } = req.body;
    const postId = (await postDB.createPost(body, req.user.id)).id;

    await uploadPictures(postId, req.files);

    if (!postId) {
      throw new Error("Error creating post.");
    }

    res.json({ success: true, message: "Post create successfully." });
  },
];

const getPostById = [
  validator.postExist(),
  validator.checkValidations(),
  async function (req, res) {
    const post = await postDB.getPostById(req.params.postId, req.user?.id);
    const pictures = await pictureDB.getPostPictures(req.params.postId);

    if (pictures.length > 0) {
      post.pictures = pictures;
    }

    res.json({ success: true, post });
  },
];

const getAllPosts = [
  async function (req, res) {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let posts = [];

    if (userId) {
      posts = await postDB.getPostsByUserId(
        userId,
        limit,
        offset,
        req.user?.id,
      );
    } else {
      posts = await postDB.getAllPosts(limit, offset, req.user?.id);
    }

    await addPostsPictures(posts);

    res.json({ success: true, posts, page, limit });
  },
];

const getFeedPosts = [
  validator.isAuthenticated(),
  async function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const posts = await postDB.getFeedPosts(req.user.id, limit, offset);
    await addPostsPictures(posts);

    res.json({ success: true, posts, page, limit });
  },
];

const updatePost = [
  upload,
  validator.isAuthenticated(),
  validator.postBelongToUser(),
  validatePostBody(),
  validator.checkValidations(),
  async function (req, res) {
    const { body } = req.body;
    const files = req.files;

    const dpValue = req.body["delete-pictures"];
    const deletePictures = Array.isArray(dpValue)
      ? dpValue
      : dpValue
        ? [dpValue]
        : [];

    await uploadPictures(req.params.postId, files);
    for (const pictureId of deletePictures) {
      const deletedPicture = await pictureDB.deletePostPictureById(pictureId);
      if (deletedPicture.public_id) {
        await cloudinary.uploader.destroy(deletedPicture.public_id, {
          resource_type: "image",
        });
      }
    }

    const id = await postDB.updatePost(body, req.params.postId);

    if (!id) {
      throw new Error("Error updating post.");
    }

    res.json({ success: true, message: "Post updated successfully." });
  },
];

const deletePost = [
  validator.isAuthenticated(),
  validator.postBelongToUser(),
  validator.checkValidations(),
  async function (req, res) {
    const deletedPictures = await pictureDB.getPostPictures(req.params.postId);
    const deletedPost = await postDB.deletePost(req.params.postId);

    if (!deletedPost) {
      throw new Error("Error deleting post.");
    }

    for (const deletedPicture of deletedPictures) {
      if (deletedPicture.public_id !== null) {
        await cloudinary.uploader.destroy(deletedPicture.public_id, {
          resource_type: "image",
        });
      }
    }

    res.json({ success: true, message: "Post deleted successfully." });
  },
];

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getFeedPosts,
  updatePost,
  deletePost,
};
