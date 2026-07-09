const { runQuery } = require("./runQuery");

async function getAllPosts(limit, offset) {
  const query = `
    SELECT posts.*, COALESCE(profiles.name, users.username) as author FROM posts
    JOIN users
      ON posts.user_id = users.id
    LEFT JOIN profiles
      ON users.id = profiles.user_id
    ORDER BY posts.created_at DESC
    LIMIT $1
    OFFSET $2;
  `;
  const params = [limit, offset];

  const res = await runQuery(query, params);
  return res;
}

async function getPostsByUserId(id) {
  const query = `
    SELECT posts.*, COALESCE(profiles.name, users.username) as author FROM posts
    JOIN users
      ON posts.user_id = users.id
    LEFT JOIN profiles
      ON users.id = profiles.user_id
    WHERE posts.user_id = $1
    ORDER BY posts.created_at DESC
  `;
  const params = [id];

  const res = await runQuery(query, params);
  return res;
}

async function getPostById(id) {
  const query = "SELECT * FROM posts WHERE id = $1";
  const params = [id];

  const res = await runQuery(query, params);
  return res[0];
}

async function createPost(body, user_id) {
  const query = `
    INSERT INTO posts (
      body, user_id
    ) VALUES (
      $1 ,$2
    ) RETURNING id;`;
  const params = [body, user_id];

  const res = await runQuery(query, params);
  return res[0];
}

async function updatePost(body, id = 0) {
  const query = `
    UPDATE posts SET
      body = $1
    WHERE id = $2
    RETURNING id;`;
  const params = [body, id];

  const res = await runQuery(query, params);
  return res[0];
}

async function deletePost(id = 0) {
  const query = `
    DELETE FROM posts
    WHERE id = $1
    RETURNING id;`;
  const params = [id];

  const res = await runQuery(query, params);
  return res[0];
}

module.exports = {
  getAllPosts,
  getPostsByUserId,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
