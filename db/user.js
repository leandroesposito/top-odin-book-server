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
  const query = "SELECT id, username FROM users WHERE id = $1";
  const params = [id];

  const rows = await runQuery(query, params);
  return rows[0];
}

module.exports = {
  getUserByUsername,
  getUserById,
  createUser,
};
