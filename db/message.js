const { runQuery } = require("./runQuery");

async function sendMessage(senderId, receiverId, body, created_at) {
  const query = `
    INSERT INTO messages
      (sender_id, receiver_id, body, created_at)
    VALUES
      ($1, $2, $3, $4)
    RETURNING id;
  `;
  const params = [senderId, receiverId, body, created_at];

  const result = await runQuery(query, params);

  return result[0].id;
}

async function getChat(user_id1, user_id2) {
  const query = `
    SELECT
      m.id,
      sender_id,
      COALESCE(p.name, u.username) as name,
      body,
      created_at
    FROM messages m
    JOIN users u
      ON m.sender_id = u.id
    LEFT JOIN profiles p
      ON p.user_id = u.id
    WHERE
      (sender_id = $1 AND receiver_id = $2) OR
      (sender_id = $2 AND receiver_id = $1)
    ORDER BY created_at;
  `;
  const params = [user_id1, user_id2];

  const messages = await runQuery(query, params);

  return messages;
}

async function getChats(userId) {
  const query = `
    SELECT
        u.id,
        COALESCE(p.name, u.username) as name,
        u.last_active,
        MAX(m.created_at) AT TIME ZONE 'UTC' as last_message_time,
        COALESCE((
            SELECT COUNT(*)
            FROM messages m2
            LEFT JOIN messages_last_read lr
                ON lr.user_id1 = $1 AND lr.user_id2 = m2.sender_id
            WHERE m2.receiver_id = $1
                AND m2.sender_id = u.id
                AND m2.created_at > COALESCE(lr.last_seen, '2000-01-01')
        ), 0) as unread_count
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    LEFT JOIN friends f ON (u.id = f.user_id1 AND f.user_id2 = $1) OR
      (u.id = f.user_id2 AND f.user_id1 = $1)
    LEFT JOIN messages m ON
        (m.sender_id = u.id AND m.receiver_id = $1) OR
        (m.receiver_id = u.id AND m.sender_id = $1)
    WHERE (f.user_id1 IS NOT NULL OR m.id IS NOT NULL) AND u.id != $1
    GROUP BY u.id, COALESCE(p.name, u.username), u.last_active
    ORDER BY MAX(m.created_at) DESC NULLS LAST, unread_count DESC NULLS LAST;
  `;
  const params = [userId];

  const rows = await runQuery(query, params);
  return rows;
}

async function updateChatLastSeen(userId1, userId2, lastSeen) {
  const query = `
    INSERT INTO messages_last_read (user_id1, user_id2, last_seen)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id1, user_id2)
    DO UPDATE SET last_seen = $3;
  `;
  const params = [userId1, userId2, lastSeen];

  await runQuery(query, params);
}

async function deleteMessage(id) {
  const query = `
    DELETE from messages WHERE id = $1
  `;
  const params = [id];

  await runQuery(query, params);
  return true;
}

async function getMessageSenderId(id) {
  const query = `
    SELECT id, sender_id from messages where id = $1;
  `;
  const params = [id];

  const res = await runQuery(query, params);
  return res[0];
}

module.exports = {
  sendMessage,
  getChat,
  getChats,
  updateChatLastSeen,
  deleteMessage,
  getMessageSenderId,
};
