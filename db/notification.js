const { runQuery } = require("./runQuery");

async function getNotifications(userId) {
  const query = `
    SELECT
      (
      SELECT COUNT(*) FROM friends_requests
        WHERE receiver_id = $1
      ) as friends_requests,
      (
      SELECT COUNT(*) FROM messages  as m
        LEFT JOIN messages_last_read as mlr
          ON m.sender_id = mlr.user_id2 AND m.receiver_id = mlr.user_id1
        WHERE m.receiver_id = $1
          AND m.created_at > COALESCE(mlr.last_seen, '2000-01-01')
      ) as messages_unread_count;
  `;
  const params = [userId];

  const res = await runQuery(query, params);
  return res[0];
}

module.exports = { getNotifications };
