const { runQuery } = require("./runQuery");

function sortParams(first, second) {
  return first < second ? [first, second] : [second, first];
}

async function addFriendsPair(user_id1, user_id2) {
  const [lower, higher] = sortParams(user_id1, user_id2);

  const query = `
    INSERT INTO friends (
      user_id1,
      user_id2
    ) VALUES (
      $1,
      $2
    ) RETURNING *;
  `;
  const params = [lower, higher];

  const res = await runQuery(query, params);
  return res[0];
}

async function getFriendsPair(user_id1, user_id2) {
  const [lower, higher] = sortParams(user_id1, user_id2);

  const query = `
    SELECT * FROM friends
    WHERE
      user_id1 = $1 AND
      user_id2 = $2;
  `;
  const params = [lower, higher];

  const res = await runQuery(query, params);
  return res[0];
}

async function getFriendsList(userId) {
  const query = `
    SELECT
      u.id,
      COALESCE(p.name, u.username) as name,
      p.profile_picture_url
    FROM users u
    LEFT JOIN profiles p
      ON u.id = p.user_id
    JOIN friends
      ON (user_id1 = u.id AND user_id2 = $1) OR
        (user_id1 = $1 AND user_id2 = u.id)
    ;
  `;
  const params = [userId];

  const res = await runQuery(query, params);
  return res;
}

async function getNotFriendsList(userId) {
  const query = `
    SELECT
      u.id,
      COALESCE(p.name, u.username) as name,
      p.profile_picture_url
    FROM users u
    LEFT JOIN profiles p
      ON u.id = p.user_id
    LEFT JOIN friends f
      ON (user_id1 = u.id AND user_id2 = $1) OR
      (user_id1 = $1 AND user_id2 = u.id)
    LEFT JOIN friends_requests fr
      ON (fr.sender_id = u.id AND fr.receiver_id = $1) OR
        (fr.sender_id = $1 AND fr.receiver_id = u.id)
    WHERE
      u.id != $1 AND
      f.user_id1 IS NULL AND
      f.user_id2 IS NULL AND
      fr.sender_id IS NULL AND
      fr.receiver_id IS NULL
    ;
  `;
  const params = [userId];

  const res = await runQuery(query, params);
  return res;
}

async function deleteFriendsPair(user_id1, user_id2) {
  const [lower, higher] = sortParams(user_id1, user_id2);

  const query = `
    DELETE FROM friends
    WHERE
      user_id1 = $1 AND
      user_id2 = $2
    RETURNING *;
  `;
  const params = [lower, higher];

  const res = await runQuery(query, params);
  return res[0];
}

module.exports = {
  addFriendsPair,
  getFriendsPair,
  getFriendsList,
  getNotFriendsList,
  deleteFriendsPair,
};
