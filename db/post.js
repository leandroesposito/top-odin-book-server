const { runQuery } = require("./runQuery");

async function getAllPosts(limit, offset) {
  const query = `
    SELECT
      posts.*,
      COALESCE(profiles.name, users.username) as author,
      profiles.profile_picture_url,
      l.likes_count,
      c.comments_count
    FROM posts
    JOIN users
      ON posts.user_id = users.id
    LEFT JOIN profiles
      ON users.id = profiles.user_id
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INTEGER as likes_count FROM likes WHERE post_id = posts.id
    ) as l ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INTEGER as comments_count FROM comments WHERE post_id = posts.id
    ) as c ON true
    ORDER BY posts.created_at DESC
    LIMIT $1
    OFFSET $2;
  `;

  const params = [limit, offset];

  const res = await runQuery(query, params);
  return res;
}

async function getPostsByUserId(id, limit, offset) {
  const query = `
    SELECT
      posts.*,
      COALESCE(profiles.name, users.username) as author,
      profiles.profile_picture_url,
      l.likes_count,
      c.comments_count
    FROM posts
    JOIN users
      ON posts.user_id = users.id
    LEFT JOIN profiles
      ON users.id = profiles.user_id
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INTEGER as likes_count FROM likes WHERE post_id = posts.id
    ) as l ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INTEGER as comments_count FROM comments WHERE post_id = posts.id
    ) as c ON true
    WHERE posts.user_id = $1
    ORDER BY posts.created_at DESC
    LIMIT $2
    OFFSET $3;
  `;
  const params = [id, limit, offset];

  const res = await runQuery(query, params);
  return res;
}

async function getFeedPosts(user_id, limit, offset) {
  const query = `
    SELECT
      posts.*,
      COALESCE(profiles.name, users.username) as author,
      profiles.profile_picture_url,
      l.likes_count,
      c.comments_count
    FROM posts
    JOIN users
      ON posts.user_id = users.id
    LEFT JOIN profiles
      ON users.id = profiles.user_id
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INTEGER as likes_count FROM likes WHERE post_id = posts.id
    ) as l ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INTEGER as comments_count FROM comments WHERE post_id = posts.id
    ) as c ON true
    WHERE posts.user_id IN (
      SELECT user_id1 FROM friends WHERE user_id2 = $1
      UNION
      SELECT user_id2 FROM friends WHERE user_id1 = $1
    )
    ORDER BY posts.created_at DESC
    LIMIT $2
    OFFSET $3;
  `;
  const params = [user_id, limit, offset];

  const res = await runQuery(query, params);
  return res;
}

async function getPostById(id) {
  const query = `
    SELECT
      posts.*,
      COALESCE(profiles.name, users.username) as author,
      profiles.profile_picture_url,
      l.likes_count,
      c.comments_count
    FROM posts
    JOIN users
      ON posts.user_id = users.id
    LEFT JOIN profiles
      ON users.id = profiles.user_id
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INTEGER as likes_count FROM likes WHERE post_id = posts.id
    ) as l ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INTEGER as comments_count FROM comments WHERE post_id = posts.id
    ) as c ON true
    WHERE posts.id = $1;
  `;
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
  getFeedPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
