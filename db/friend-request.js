const { runQuery } = require("./runQuery");

async function createFriendRequest(sender_id, receiver_id) {
  const query = `
    INSERT INTO friends_requests (
      sender_id,
      receiver_id
    ) VALUES (
      $1,
      $2
    ) RETURNING *;
  `;
  const params = [sender_id, receiver_id];

  const res = await runQuery(query, params);
  return res[0];
}

async function getFriendRequest(sender_id, receiver_id) {
  const query = `
    SELECT * FROM friends_requests WHERE sender_id = $1 AND receiver_id = $2;
  `;
  const params = [sender_id, receiver_id];

  const res = await runQuery(query, params);
  return res[0];
}

async function getAllFriendsRequests(userId) {
  const query = `
    SELECT
      u.id,
      COALESCE(p.name, u.username) as name,
      p.profile_picture_url,
      fr.*
      FROM friends_requests fr
    JOIN users u
      ON u.id = fr.sender_id OR  u.id = fr.receiver_id
    LEFT JOIN profiles p
      ON u.id = p.user_id
    WHERE (receiver_id = $1
      OR sender_id = $1) AND
      u.id != $1;
  `;
  const params = [userId];

  const res = await runQuery(query, params);
  return res;
}

async function deleteFriendRequest(sender_id, receiver_id) {
  const query = `
    DELETE FROM friends_requests
    WHERE
      sender_id = $1 AND
      receiver_id = $2
    RETURNING *;
  `;
  const params = [sender_id, receiver_id];

  const res = await runQuery(query, params);
  return res[0];
}

module.exports = {
  createFriendRequest,
  getFriendRequest,
  getAllFriendsRequests,
  deleteFriendRequest,
};
