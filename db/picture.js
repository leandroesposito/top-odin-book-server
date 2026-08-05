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

async function uploadMessagePicture(messageId, pictureUrl, publicId) {
  const query = `
    INSERT INTO messages_pictures (
      message_id, url, public_id
    ) VALUES (
      $1,
      $2,
      $3
    )
    RETURNING id;
  `;

  const params = [messageId, pictureUrl, publicId];

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

async function getMessagePictures(messageId) {
  const query = `
    SELECT * FROM messages_pictures
    WHERE message_id = $1;
  `;

  const params = [messageId];

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

async function deleteMessagePictureById(pictureId) {
  const query = "DELETE from messages_pictures WHERE id = $1 RETURNING *;";
  const params = [pictureId];

  const res = await runQuery(query, params);
  return res[0];
}

async function deleteMessagePictures(messageId) {
  const query =
    "DELETE from messages_pictures WHERE message_id = $1 RETURNING *";
  const params = [messageId];

  const res = await runQuery(query, params);
  return res;
}

module.exports = {
  uploadPostPicture,
  uploadMessagePicture,
  getPostPictures,
  getMessagePictures,
  deletePostPictureById,
  deletePostPictures,
  deleteMessagePictureById,
  deleteMessagePictures,
};
