const { runQuery } = require("./runQuery");

async function postIsLiked(userId, postId) {
  const query = `
    SELECT * FROM likes WHERE user_id = $1 AND post_id = $2;
  `;

  const params = [userId, postId];

  const res = await runQuery(query, params);
  return res.length > 0;
}

async function addLike(userId, postId) {
  const query = `
    INSERT INTO likes (
      user_id, post_id
    ) VALUES (
      $1,
      $2
    )
    RETURNING
      user_id,
      post_id;
  `;

  const params = [userId, postId];

  const res = await runQuery(query, params);
  return res[0];
}

async function removeLike(userId, postId) {
  const query = `
    DELETE FROM likes
    WHERE
      user_id = $1 AND post_id = $2
    RETURNING
      user_id,
      post_id;
  `;

  const params = [userId, postId];

  const res = await runQuery(query, params);
  return res[0];
}

module.exports = {
  postIsLiked,
  addLike,
  removeLike,
};
