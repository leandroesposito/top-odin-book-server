const query = `
DROP TABLE IF EXISTS friends;
DROP TABLE IF EXISTS friends_requests;
DROP TABLE IF EXISTS posts_pictures;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS messages_pictures;
DROP TABLE IF EXISTS messages_last_read;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY ( INCREMENT 7 START 1000000 ),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY ( INCREMENT 7 START 1000000 ),
  name TEXT,
  bio TEXT,
  birthdate DATE DEFAULT '2000-01-01',
  profession TEXT,
  profile_picture_url TEXT,
  online_status boolean DEFAULT false,
  user_id integer REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS friends (
  uid1 integer REFERENCES users(id) ON DELETE CASCADE,
  uid2 integer REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uid1_lessthan_uid2 CHECK (uid1 < uid2),
  PRIMARY KEY ( uid1, uid2 )
);

CREATE TABLE IF NOT EXISTS friends_requests (
  sender_id integer REFERENCES users(id) ON DELETE CASCADE,
  receiver_id integer REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY ( sender_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS posts (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY ( INCREMENT 7 START 1000000 ),
  body TEXT,
  uid integer references users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts_pictures (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY ( INCREMENT 7 START 1000000 ),
  post_id integer REFERENCES posts(id) ON DELETE CASCADE,
  url TEXT
);

CREATE TABLE IF NOT EXISTS likes (
  uid integer REFERENCES users(id) ON DELETE CASCADE,
  post_id integer REFERENCES posts(id) ON DELETE CASCADE,
  PRIMARY KEY (uid, post_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY ( INCREMENT 7 START 1000000 ),
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  post_id integer REFERENCES posts(id) ON DELETE CASCADE,
  uid integer REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY ( INCREMENT 7 START 1000000 ),
  body TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sender_id integer REFERENCES users(id) ON DELETE CASCADE,
  receiver_id integer REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages_pictures (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY ( INCREMENT 7 START 1000000 ),
  url TEXT,
  message_id integer REFERENCES messages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages_last_read (
  uid1 integer REFERENCES users(id) ON DELETE CASCADE,
  uid2 integer REFERENCES users(id) ON DELETE CASCADE,
  last_seen TIMESTAMP DEFAULT '2000-01-01',
  PRIMARY KEY ( uid1, uid2 )
)
`;

async function createTables(client) {
  await client.query(query);
}

module.exports = { createTables };
