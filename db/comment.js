const { runQuery } = require("./runQuery");

async function getCommentById(id) {
  const query = `
    SELECT * FROM comments WHERE id = $1;
  `;
  const params = [id];

  const res = await runQuery(query, params);
  return res[0];
}

async function getPostComments(postId) {
  const query = `
    SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC;
  `;

  const params = [postId];

  const res = await runQuery(query, params);
  return res;
}

async function createComment(userId, postId, body) {
  const query = `
    INSERT INTO comments (
      user_id,
      post_id,
      body
    ) VALUES (
      $1,
      $2,
      $3
    )
    RETURNING *;
  `;

  const params = [userId, postId, body];

  const res = await runQuery(query, params);
  return res[0];
}

async function deleteComment(id) {
  const query = `
    DELETE FROM comments
    WHERE
      id = $1
    RETURNING id;
  `;

  const params = [id];

  const res = await runQuery(query, params);
  return res[0];
}

module.exports = {
  getCommentById,
  getPostComments,
  createComment,
  deleteComment,
};
