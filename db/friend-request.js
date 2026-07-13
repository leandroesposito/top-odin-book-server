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
    SELECT * FROM friends_requests WHERE receiver_id = $1 OR sender_id = $1;
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
