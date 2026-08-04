const { runQuery } = require("./runQuery");

async function uploadPostPicture(postId, pictureUrl, publicId) {
  const query = `
    INSERT INTO posts_pictures (
      post_id, url, public_id
    ) VALUES (
      $1,
      $2,
      $3
    )
    RETURNING id;
  `;

  const params = [postId, pictureUrl, publicId];

  const res = await runQuery(query, params);
  return res[0];
}

async function getPostPictures(postId) {
  const query = `
    SELECT * FROM posts_pictures
    WHERE post_id = $1;
  `;

  const params = [postId];

  const res = await runQuery(query, params);
  return res;
}

async function deletePostPictureById(pictureId) {
  const query = "DELETE from posts_pictures WHERE id = $1 RETURNING *;";
  const params = [pictureId];

  const res = await runQuery(query, params);
  return res[0];
}

async function deletePostPictures(postId) {
  const query = "DELETE from posts_pictures WHERE post_id = $1 RETURNING *;";
  const params = [postId];

  const res = await runQuery(query, params);
  return res;
}

module.exports = {
  uploadPostPicture,
  getPostPictures,
  deletePostPictureById,
  deletePostPictures,
};
