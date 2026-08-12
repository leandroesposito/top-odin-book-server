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

async function getFriendsList(userId, currentUserId) {
  const query = `
    SELECT
      u.id,
      COALESCE(p.name, u.username) as name,
      p.profile_picture_url,
      CASE WHEN $2 IS NULL THEN NULL
      WHEN u.id = $2 THEN true ELSE false END AS "isMyself",
      CASE WHEN $2 IS NULL THEN NULL
      WHEN f_me.user_id1 IS NOT NULL THEN true ELSE false END AS "isFriend",
      CASE WHEN $2 IS NULL THEN NULL
      WHEN sent.sender_id IS NOT NULL THEN true ELSE false END AS "requestSent",
      CASE WHEN $2 IS NULL THEN NULL
      WHEN received.receiver_id IS NOT NULL THEN true ELSE false END AS "requestReceived"
    FROM users u
    LEFT JOIN profiles p
      ON u.id = p.user_id
    JOIN friends f
      ON (f.user_id1 = u.id AND f.user_id2 = $1) OR
      (f.user_id1 = $1 AND f.user_id2 = u.id)
    LEFT JOIN friends f_me
      ON (f_me.user_id1 = u.id AND f_me.user_id2 = $2) OR
      (f_me.user_id1 = $2 AND f_me.user_id2 = u.id)
    LEFT JOIN friends_requests sent
      ON (sent.sender_id = $2 AND sent.receiver_id = u.id)
    LEFT JOIN friends_requests received
      ON (received.sender_id = u.id AND received.receiver_id = $2)
    ;
  `;
  const params = [userId, currentUserId];

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

async function getNotFriendsRandomList(userId, count = 50) {
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
    ORDER BY RANDOM()
    LIMIT $2
    ;
  `;
  const params = [userId, count];

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
  getNotFriendsRandomList,
  deleteFriendsPair,
};
