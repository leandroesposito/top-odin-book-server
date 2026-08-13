const { runQuery } = require("./runQuery");
const bcrypt = require("bcryptjs");

async function createUser(username, password) {
  const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id;`;
  const params = [username, password];

  const res = await runQuery(query, params);
  return res[0];
}

async function getUserByUsername(username) {
  const query = `
    SELECT u.id, u.username, u.password, COALESCE(p.name, u.username) as name
    FROM users u
    LEFT JOIN profiles p
      ON u.id = p.user_id
    WHERE u.username = $1
  `;
  const params = [username];

  const rows = await runQuery(query, params);
  return rows[0];
}

async function getUserById(id) {
  const query = `
    SELECT
      u.id,
      username,
      COALESCE(p.name, u.username) as name
    FROM users u
    LEFT JOIN profiles p
      ON p.user_id = u.id
    WHERE u.id = $1
  `;
  const params = [id];

  const rows = await runQuery(query, params);
  return rows[0];
}

async function searchUsers(search, currentUserId) {
  const query = `
    SELECT
      u.id,
      COALESCE(p.name, u.username) as name,
      p.profile_picture_url,
      word_similarity(COALESCE(p.name, u.username), $1) as smrty,
      CASE WHEN $2 IS NULL THEN NULL
      WHEN f_me.user_id1 IS NOT NULL THEN true ELSE false END AS "isFriend",
      CASE WHEN $2 IS NULL THEN NULL
      WHEN sent.sender_id IS NOT NULL THEN true ELSE false END AS "requestSent",
      CASE WHEN $2 IS NULL THEN NULL
      WHEN received.receiver_id IS NOT NULL THEN true ELSE false END AS "requestReceived"
    FROM users u
    LEFT JOIN profiles p
      ON u.id = p.user_id
    LEFT JOIN friends f_me
      ON (f_me.user_id1 = u.id AND f_me.user_id2 = $2) OR
      (f_me.user_id1 = $2 AND f_me.user_id2 = u.id)
    LEFT JOIN friends_requests sent
      ON (sent.sender_id = $2 AND sent.receiver_id = u.id)
    LEFT JOIN friends_requests received
      ON (received.sender_id = u.id AND received.receiver_id = $2)
    WHERE
      word_similarity(COALESCE(p.name, u.username), $1) > 0.2 AND
      ( $2::INTEGER IS NULL OR u.id != $2::INTEGER )
    ORDER BY smrty DESC;
  `;
  const params = [search, currentUserId ?? null];

  const rows = await runQuery(query, params);
  return rows;
}

module.exports = {
  getUserByUsername,
  getUserById,
  createUser,
  searchUsers,
};
