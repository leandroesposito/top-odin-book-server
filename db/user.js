const { runQuery } = require("./runQuery");
const pool = require("./pool");
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

async function resetGuestUser() {
  const delQuery = `
    -- ============================================
    -- RESET GUEST USER
    -- ============================================
    -- Delete existing guest user (cascades to all related data)
    DELETE FROM users WHERE username = 'guest_user';
  `;

  const insQuery = `
    -- ============================================
    -- CREATE GUEST USER
    -- ============================================
    INSERT INTO users (username, password) VALUES
      ('guest_user', '$2b$10$yQRc0h2FgMb53/dbl9u0iupBJOeb2QrsIpoZg5rBYwFENud0O1oEi')
    RETURNING id;
  `;

  await runQuery(delQuery);
  const res = await runQuery(insQuery);
  return res[0].id;
}

async function createGuestData(guestId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ============================================
    // GUEST PROFILE
    // ============================================
    await client.query(
      `INSERT INTO profiles (name, bio, birthdate, profession, profile_picture_url, user_id)
       VALUES ('Guest User', 'Just exploring! 👋 Demo account for testing.', '2000-01-01', 'Explorer', 'https://i.pravatar.cc/150?u=guest_6', $1)`,
      [guestId],
    );

    // ============================================
    // FRIENDS (2 friends)
    // ============================================
    await client.query(
      `INSERT INTO friends (user_id1, user_id2) VALUES (1000000, $1), (1000007, $1)`,
      [guestId],
    );

    // ============================================
    // FRIEND REQUESTS (1 received, 1 sent)
    // ============================================
    await client.query(
      `INSERT INTO friends_requests (sender_id, receiver_id) VALUES (1000014, $1)`,
      [guestId],
    );
    await client.query(
      `INSERT INTO friends_requests (sender_id, receiver_id) VALUES ($1, 1000021)`,
      [guestId],
    );

    // ============================================
    // POSTS (2 posts)
    // ============================================
    const firstPost = await client.query(
      `INSERT INTO posts (body, user_id, created_at)
       VALUES ('Hello everyone! Just testing out this awesome social network. 👋', $1, CURRENT_TIMESTAMP - INTERVAL '2 hours')
       RETURNING id`,
      [guestId],
    );
    const firstPostId = firstPost.rows[0].id;

    const secondPost = await client.query(
      `INSERT INTO posts (body, user_id, created_at)
       VALUES ('Loving the clean design. Anyone else exploring as a guest?', $1, CURRENT_TIMESTAMP - INTERVAL '1 hour')
       RETURNING id`,
      [guestId],
    );
    const secondPostId = secondPost.rows[0].id;

    // ============================================
    // POST PICTURES (1 picture on first post)
    // ============================================
    await client.query(
      `INSERT INTO posts_pictures (post_id, url)
       VALUES ($1, 'https://picsum.photos/seed/guestpost/600/400')`,
      [firstPostId],
    );

    // ============================================
    // LIKES (Guest liked others' posts, others liked Guest's posts)
    // ============================================
    // Others liked Guest's posts
    await client.query(
      `INSERT INTO likes (user_id, post_id) VALUES
       (1000000, $1),   -- Alice liked Guest's first post
       (1000007, $1),   -- Bob liked Guest's first post
       (1000014, $2);  -- Carol liked Guest's second post`,
      [firstPostId, secondPostId],
    );

    // Guest liked others' posts
    await client.query(
      `INSERT INTO likes (user_id, post_id) VALUES
       ($1, 1000000),   -- Guest liked Alice's post
       ($1, 1000007),   -- Guest liked Bob's post
       ($1, 1000014);  -- Guest liked Carol's post`,
      [guestId],
    );

    // ============================================
    // COMMENTS (on Guest's posts and by Guest)
    // ============================================
    // Comments on Guest's posts
    await client.query(
      `INSERT INTO comments (body, post_id, user_id, created_at) VALUES
       ('Welcome! Great to have you here.', $1, 1000000, CURRENT_TIMESTAMP - INTERVAL '90 minutes'),
       ('Nice post! Enjoy exploring.', $1, 1000007, CURRENT_TIMESTAMP - INTERVAL '85 minutes'),
       ('Demo accounts are the best!', $2, 1000014, CURRENT_TIMESTAMP - INTERVAL '45 minutes')`,
      [firstPostId, secondPostId],
    );

    // Guest commented on others' posts
    await client.query(
      `INSERT INTO comments (body, post_id, user_id, created_at) VALUES
       ('This design is beautiful!', 1000000, $1, CURRENT_TIMESTAMP - INTERVAL '80 minutes'),
       ('Congrats on the deployment!', 1000007, $1, CURRENT_TIMESTAMP - INTERVAL '70 minutes'),
       ('Love that book too!', 1000014, $1, CURRENT_TIMESTAMP - INTERVAL '40 minutes')`,
      [guestId],
    );

    // ============================================
    // MESSAGES (Received and Sent)
    // ============================================
    // Messages received from Alice and Bob
    await client.query(
      `INSERT INTO messages (body, sender_id, receiver_id, created_at) VALUES
       ('Hey Guest! Welcome to the platform. Let me know if you need anything.', 1000000, $1, CURRENT_TIMESTAMP - INTERVAL '100 minutes'),
       ('How are you finding everything so far?', 1000000, $1, CURRENT_TIMESTAMP - INTERVAL '50 minutes')`,
      [guestId],
    );

    const thirdMessage = await client.query(
      `INSERT INTO messages (body, sender_id, receiver_id, created_at)
        VALUES ('Guest! Good to see you exploring. Check out my microservice post!', 1000007, $1, CURRENT_TIMESTAMP - INTERVAL '75 minutes')
        RETURNING id`,
      [guestId],
    );

    const thirdMessageId = thirdMessage.rows[0].id;

    await client.query(
      `INSERT INTO messages_pictures (url, message_id)
        VALUES ('https://picsum.photos/id/180/300/400', $1),
                ('https://picsum.photos/id/304/200/300', $1),
                ('https://picsum.photos/id/341/600/400', $1)`,
      [thirdMessageId],
    );

    // Messages sent by Guest
    await client.query(
      `INSERT INTO messages (body, sender_id, receiver_id, created_at) VALUES
       ('Thanks Alice! Everyone is so welcoming here.', $1, 1000000, CURRENT_TIMESTAMP - INTERVAL '95 minutes'),
       ('Your design posts are inspiring!', $1, 1000000, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
       ('Hey Bob! Just read your microservice post. Very cool!', $1, 1000007, CURRENT_TIMESTAMP - INTERVAL '70 minutes')`,
      [guestId],
    );

    // ============================================
    // MESSAGES LAST READ
    // ============================================
    await client.query(
      `INSERT INTO messages_last_read (user_id1, user_id2, last_seen) VALUES
       ($1, 1000000, CURRENT_TIMESTAMP - INTERVAL '40 minutes'),   -- Guest read Alice's messages
       ($1, 1000007, CURRENT_TIMESTAMP - INTERVAL '65 minutes')  -- Guest read Bob's messages`,
      [guestId],
    );

    await client.query("COMMIT");
    console.log("Guest data created successfully for user ID:", guestId);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating guest data:", error);
    throw error;
  } finally {
    client.release();
  }
  return true;
}

module.exports = {
  getUserByUsername,
  getUserById,
  createUser,
  searchUsers,
  resetGuestUser,
  createGuestData,
};
