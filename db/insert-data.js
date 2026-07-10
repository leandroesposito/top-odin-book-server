const bcrypt = require("bcryptjs");

const passwords = ["pawonder", "pbbuilder", "pcreads", "pdcodes"];

const hashedPasswords = [
  "$2b$10$d0Z7nCWx1LaFsYpADo/avuo..EeBs8M9lg8s2rPAEtq4OA5WnCzOO",
  "$2b$10$E8sWYwYLr7eEc4rYJGWFC.x1XY53KZpH4WbXoHVVc.lxOWgLXteCS",
  "$2b$10$KINmqySdjYAa1qtrEOhaH.Diya.Gj1RCejHSM.fEFk5Rks5IQdRkG",
  "$2b$10$N7EbrhzEvTHF3tGvA0CWK.xxqQuOPqubundUAievCUohuzR4ag1Ku",
];

const query = `
-- ============================================
-- USERS
-- ============================================
INSERT INTO users (username, password) VALUES
  ('alice_wonder', '$2b$10$d0Z7nCWx1LaFsYpADo/avuo..EeBs8M9lg8s2rPAEtq4OA5WnCzOO'),
  ('bob_builder', '$2b$10$E8sWYwYLr7eEc4rYJGWFC.x1XY53KZpH4WbXoHVVc.lxOWgLXteCS'),
  ('carol_reads', '$2b$10$KINmqySdjYAa1qtrEOhaH.Diya.Gj1RCejHSM.fEFk5Rks5IQdRkG'),
  ('dave_codes', '$2b$10$N7EbrhzEvTHF3tGvA0CWK.xxqQuOPqubundUAievCUohuzR4ag1Ku');

-- Let's reference them by the IDs they get:
-- Alice = 1000000, Bob = 1000007, Carol = 1000014, Dave = 1000021

-- ============================================
-- PROFILES
-- ============================================
INSERT INTO profiles (name, bio, birthdate, profession, profile_picture_url, user_id) VALUES
  ('Alice Wonder', 'Love exploring new places and reading fantasy novels', '1995-03-12', 'UX Designer', 'https://i.pravatar.cc/150?u=alice', 1000000),
  ('Bob Builder', 'Can we fix it? Yes we can!', '1992-07-25', 'Software Engineer', 'https://i.pravatar.cc/150?u=bob', 1000007),
  ('Carol Reads', 'Book lover and coffee enthusiast', '1998-11-03', 'Librarian', 'https://i.pravatar.cc/150?u=carol', 1000014),
  ('Dave Codes', 'Full-stack dev. Open source contributor.', '1994-01-18', 'Developer', 'https://i.pravatar.cc/150?u=dave', 1000021);

-- ============================================
-- FRIENDS (accepted)
-- ============================================
-- Alice <-> Bob, Alice <-> Carol, Bob <-> Dave
INSERT INTO friends (user_id1, user_id2) VALUES
  (1000000, 1000007),
  (1000000, 1000014),
  (1000007, 1000021);

-- ============================================
-- FRIEND REQUESTS (pending)
-- ============================================
-- Carol sent request to Dave (pending)
INSERT INTO friends_requests (sender_id, receiver_id) VALUES
  (1000014, 1000021);

-- ============================================
-- POSTS
-- ============================================
INSERT INTO posts (body, user_id, created_at) VALUES
  ('Just finished a new design prototype. Feeling inspired!', 1000000, '2026-06-20 09:15:00'),
  ('Deployed my first microservice today. No downtime!', 1000007, '2026-06-20 10:30:00'),
  ('Currently reading "The Name of the Wind" - absolutely captivating so far.', 1000014, '2026-06-20 14:00:00'),
  ('Working on a new open source project. Will share the repo soon!', 1000021, '2026-06-21 08:00:00'),
  ('Hot take: dark mode should be the default everywhere.', 1000000, '2026-06-22 11:45:00'),
  ('Anyone else think JavaScript fatigue is getting better lately?', 1000007, '2026-06-22 16:20:00'),
  ('Just hit 50 books this year!', 1000014, '2026-06-23 12:00:00'),
  ('Refactored a 500-line function into 10 clean functions. Feels good.', 1000021, '2026-06-24 09:00:00');

-- Post IDs: 1000000, 1000007, 1000014, 1000021, 1000028, 1000035, 1000042, 1000049

-- ============================================
-- POSTS PICTURES
-- ============================================
INSERT INTO posts_pictures (post_id, url) VALUES
  (1000000, 'https://picsum.photos/seed/post1/600/400'),
  (1000007, 'https://picsum.photos/seed/post2/600/400'),
  (1000042, 'https://picsum.photos/seed/post7/600/400');

-- ============================================
-- LIKES
-- ============================================
INSERT INTO likes (user_id, post_id) VALUES
  (1000007, 1000000), -- Bob likes Alice's post
  (1000014, 1000000), -- Carol likes Alice's post
  (1000000, 1000007), -- Alice likes Bob's post
  (1000021, 1000007), -- Dave likes Bob's post
  (1000000, 1000014), -- Alice likes Carol's post
  (1000007, 1000014), -- Bob likes Carol's post
  (1000021, 1000014), -- Dave likes Carol's post
  (1000000, 1000021), -- Alice likes Dave's post
  (1000007, 1000042), -- Bob likes Carol's book post
  (1000014, 1000049), -- Carol likes Dave's refactor post
  (1000021, 1000028); -- Dave likes Alice's dark mode post

-- ============================================
-- COMMENTS
-- ============================================
INSERT INTO comments (body, post_id, user_id, created_at) VALUES
  ('Looks amazing! What tool did you use?', 1000000, 1000007, '2026-06-20 10:00:00'),
  ('Thanks! I used Figma with some custom plugins.', 1000000, 1000000, '2026-06-20 10:45:00'),
  ('Congrats! Microservices are a game changer.', 1000007, 1000014, '2026-06-20 11:00:00'),
  ('That book is incredible. Wait until you reach chapter 20!', 1000014, 1000021, '2026-06-20 15:30:00'),
  ('No spoilers please!', 1000014, 1000014, '2026-06-20 16:00:00'),
  ('Looking forward to seeing the repo!', 1000021, 1000000, '2026-06-21 09:00:00'),
  ('PREACH. Dark mode is life.', 1000028, 1000007, '2026-06-22 12:00:00'),
  ('Definitely. The ecosystem has matured a lot.', 1000035, 1000021, '2026-06-22 17:00:00'),
  ('50 books?! That''s amazing! Any recommendations?', 1000042, 1000000, '2026-06-23 13:00:00'),
  ('Clean code is the best feeling.', 1000049, 1000007, '2026-06-24 10:00:00');

-- Comment IDs: 1000000, 1000007, 1000014, 1000021, 1000028, 1000035, 1000042, 1000049, 1000056, 1000063

-- ============================================
-- MESSAGES
-- ============================================
INSERT INTO messages (body, sender_id, receiver_id, created_at) VALUES
  ('Hey Alice, loved your new design!', 1000007, 1000000, '2026-06-20 12:00:00'),
  ('Thanks Bob! Your microservice post was inspiring.', 1000000, 1000007, '2026-06-20 12:30:00'),
  ('Want to grab coffee this weekend?', 1000014, 1000000, '2026-06-21 10:00:00'),
  ('Sure! Saturday works for me.', 1000000, 1000014, '2026-06-21 10:15:00'),
  ('What stack are you using for the open source project?', 1000007, 1000021, '2026-06-21 14:00:00'),
  ('Node.js, PostgreSQL, and React. Want to contribute?', 1000021, 1000007, '2026-06-21 14:20:00'),
  ('Have you read any good books lately?', 1000014, 1000021, '2026-06-22 09:00:00'),
  ('Mostly technical books, but I need fiction recommendations!', 1000021, 1000014, '2026-06-22 10:00:00');

-- Message IDs: 1000000, 1000007, 1000014, 1000021, 1000028, 1000035, 1000042, 1000049

-- ============================================
-- MESSAGES PICTURES
-- ============================================
INSERT INTO messages_pictures (url, message_id) VALUES
  ('https://picsum.photos/seed/msg1/400/300', 1000000);

-- ============================================
-- MESSAGES LAST READ
-- ============================================
INSERT INTO messages_last_read (user_id1, user_id2, last_seen) VALUES
  (1000000, 1000007, '2026-06-20 12:35:00'), -- Alice read Bob's messages
  (1000007, 1000000, '2026-06-20 12:05:00'), -- Bob read Alice's messages
  (1000000, 1000014, '2026-06-21 10:20:00'), -- Alice read Carol's messages
  (1000014, 1000000, '2026-06-21 10:10:00'), -- Carol read Alice's messages
  (1000007, 1000021, '2026-06-21 14:25:00'), -- Bob read Dave's messages
  (1000021, 1000007, '2026-06-21 14:10:00'); -- Dave read Bob's messages
`;

async function insertData(client) {
  await client.query(query);
}

module.exports = { insertData };
