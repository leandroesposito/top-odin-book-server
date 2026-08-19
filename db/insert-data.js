const bcrypt = require("bcryptjs");

const passwords = [
  "pawonder",
  "pbbuilder",
  "pcreads",
  "pdcodes",
  "pedesigns",
  "pffitness",
  "pggarden",
  "phhikes",
  "piwrites",
  "pjphoto",
  "pkchef",
  "plmusic",
  "pguser",
];

const hashedPasswords = [
  "$2b$10$d0Z7nCWx1LaFsYpADo/avuo..EeBs8M9lg8s2rPAEtq4OA5WnCzOO",
  "$2b$10$E8sWYwYLr7eEc4rYJGWFC.x1XY53KZpH4WbXoHVVc.lxOWgLXteCS",
  "$2b$10$KINmqySdjYAa1qtrEOhaH.Diya.Gj1RCejHSM.fEFk5Rks5IQdRkG",
  "$2b$10$N7EbrhzEvTHF3tGvA0CWK.xxqQuOPqubundUAievCUohuzR4ag1Ku",
  "$2b$10$au3RPMv6v6j2XglEnetmsurbtQmgtmFiTOkAYbd7gRNJfzP.OFTde",
  "$2b$10$LuQek9czYDhiJ8Spo6siWuKjRnJDNBnmzCqlDQlY0EvlQOsPSTbeO",
  "$2b$10$JKr4znzV677sFy8f1nzeKuJo3OTlUUNiAXc0.Plcspilsq80k1NUK",
  "$2b$10$mDEmpUSm.to881X5D2bxveNq71tjsDg3Og1Uh5uGGDRNX/a8Q0lPi",
  "$2b$10$4g1KOVeuA13hRiL2slepD.9Fp3aEkJGATmACaFOBMWvDbs5vxLM0u",
  "$2b$10$zifAEJeAWqXIDRDZQ0YT..48EGTQmBPkclJzyDrcOZo0MuFR6h3EK",
  "$2b$10$Ygp7PA6BnYJ83nXX2fKhbeMs8m49WrzPrKIFCI7ygmQt1UBIpKq.K",
  "$2b$10$4RJETXY7g1pzwLOWoJny8OClGqLwCru1OBwqGK/eRBtTiyYhXGsSK",
  "$2b$10$yQRc0h2FgMb53/dbl9u0iupBJOeb2QrsIpoZg5rBYwFENud0O1oEi",
];

const query = `
-- ============================================
-- USERS
-- ============================================
INSERT INTO users (username, password) VALUES
  ('alice_wonder', '$2b$10$d0Z7nCWx1LaFsYpADo/avuo..EeBs8M9lg8s2rPAEtq4OA5WnCzOO'),
  ('bob_builder', '$2b$10$E8sWYwYLr7eEc4rYJGWFC.x1XY53KZpH4WbXoHVVc.lxOWgLXteCS'),
  ('carol_reads', '$2b$10$KINmqySdjYAa1qtrEOhaH.Diya.Gj1RCejHSM.fEFk5Rks5IQdRkG'),
  ('dave_codes', '$2b$10$N7EbrhzEvTHF3tGvA0CWK.xxqQuOPqubundUAievCUohuzR4ag1Ku'),
  ('emma_designs', '$2b$10$au3RPMv6v6j2XglEnetmsurbtQmgtmFiTOkAYbd7gRNJfzP.OFTde'),
  ('frank_fitness', '$2b$10$LuQek9czYDhiJ8Spo6siWuKjRnJDNBnmzCqlDQlY0EvlQOsPSTbeO'),
  ('grace_garden', '$2b$10$JKr4znzV677sFy8f1nzeKuJo3OTlUUNiAXc0.Plcspilsq80k1NUK'),
  ('henry_hikes', '$2b$10$mDEmpUSm.to881X5D2bxveNq71tjsDg3Og1Uh5uGGDRNX/a8Q0lPi'),
  ('iris_writes', '$2b$10$4g1KOVeuA13hRiL2slepD.9Fp3aEkJGATmACaFOBMWvDbs5vxLM0u'),
  ('jack_photo', '$2b$10$zifAEJeAWqXIDRDZQ0YT..48EGTQmBPkclJzyDrcOZo0MuFR6h3EK'),
  ('kate_chef', '$2b$10$Ygp7PA6BnYJ83nXX2fKhbeMs8m49WrzPrKIFCI7ygmQt1UBIpKq.K'),
  ('leo_music', '$2b$10$4RJETXY7g1pzwLOWoJny8OClGqLwCru1OBwqGK/eRBtTiyYhXGsSK'),
  ('guest_user', '$2b$10$yQRc0h2FgMb53/dbl9u0iupBJOeb2QrsIpoZg5rBYwFENud0O1oEi');

-- Let's reference them by the IDs they get:
-- Alice = 1000000, Bob = 1000007, Carol = 1000014, Dave = 1000021

-- ============================================
-- PROFILES
-- ============================================
INSERT INTO profiles (name, bio, birthdate, profession, profile_picture_url, user_id) VALUES
  ('Alice Wonder', 'Love exploring new places and reading fantasy novels', '1995-03-12', 'UX Designer', 'https://i.pravatar.cc/150?u=alice_3', 1000000),
  ('Bob Builder', 'Can we fix it? Yes we can!', '1992-07-25', 'Software Engineer', 'https://i.pravatar.cc/150?u=bob_4', 1000007),
  ('Carol Reads', 'Book lover and coffee enthusiast', '1998-11-03', 'Librarian', 'https://i.pravatar.cc/150?u=carol_1', 1000014),
  ('Dave Codes', 'Full-stack dev. Open source contributor.', '1994-01-18', 'Developer', 'https://i.pravatar.cc/150?u=dave_6', 1000021),
  ('Emma Designs', 'UI/UX designer. Pixel perfectionist.', '1996-06-15', 'Designer', 'https://i.pravatar.cc/150?u=emma_3', 1000028),
  ('Frank Fitness', 'Personal trainer and nutrition coach', '1991-09-20', 'Trainer', 'https://i.pravatar.cc/150?u=frank_6', 1000035),
  ('Grace Garden', 'Plant mom 🌿 Urban gardener', '1994-04-08', 'Botanist', 'https://i.pravatar.cc/150?u=grace_2', 1000042),
  ('Henry Hikes', 'Trail explorer. 47 peaks and counting.', '1989-12-01', 'Outdoor Guide', 'https://i.pravatar.cc/150?u=henry', 1000049),
  ('Iris Writes', 'Aspiring novelist. Coffee powered.', '1997-02-14', 'Writer', 'https://i.pravatar.cc/150?u=iris_2', 1000056),
  ('Jack Photo', 'Street photographer. Capturing moments.', '1993-08-30', 'Photographer', 'https://i.pravatar.cc/150?u=jack_2', 1000063),
  ('Kate Chef', 'Home cook. Sharing recipes that work.', '1995-11-22', 'Chef', 'https://i.pravatar.cc/150?u=kate', 1000070),
  ('Leo Music', 'Guitarist. Vinyl collector. Live music lover.', '1990-05-17', 'Musician', 'https://i.pravatar.cc/150?u=leo', 1000077),
  ('Guest User', 'Just exploring! 👋 Demo account for testing.', '2000-01-01', 'Explorer', 'https://i.pravatar.cc/150?u=guest_6', 1000084);

-- ============================================
-- FRIENDS (accepted)
-- ============================================
-- Alice <-> Bob, Alice <-> Carol, Bob <-> Dave
INSERT INTO friends (user_id1, user_id2) VALUES
  -- Alice
  (1000000, 1000007), (1000000, 1000014), (1000000, 1000028),
  (1000000, 1000035), (1000000, 1000049), (1000000, 1000056),
  -- Bob
  (1000007, 1000021), (1000007, 1000035), (1000007, 1000063), (1000007, 1000077),
  -- Carol
  (1000014, 1000042), (1000014, 1000056), (1000014, 1000070),
  -- Dave
  (1000021, 1000028), (1000021, 1000063), (1000021, 1000077),
  -- Emma
  (1000028, 1000042), (1000028, 1000049), (1000028, 1000070),
  -- Frank
  (1000035, 1000049), (1000035, 1000077),
  -- Grace
  (1000042, 1000056), (1000042, 1000070),
  -- Henry
  (1000049, 1000063),
  -- Iris
  (1000056, 1000077),
  -- Jack
  (1000063, 1000070);

-- ============================================
-- FRIEND REQUESTS (pending)
-- ============================================
-- Carol sent request to Dave (pending)
INSERT INTO friends_requests (sender_id, receiver_id) VALUES
  (1000021, 1000000),  -- Dave → Alice
  (1000021, 1000014),  -- Dave → Carol
  (1000049, 1000014),  -- Henry → Carol
  (1000056, 1000021),  -- Iris → Dave
  (1000063, 1000028),  -- Jack → Emma
  (1000070, 1000035),  -- Kate → Frank
  (1000077, 1000028),  -- Leo → Emma
  (1000007, 1000042),  -- Bob → Grace
  (1000035, 1000070);  -- Frank → Kate

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
  (1000000, 'https://picsum.photos/id/20/600/400'),
  (1000007, 'https://picsum.photos/id/3/400/300'),
  (1000007, 'https://picsum.photos/id/5/300/600'),
  (1000007, 'https://picsum.photos/id/4/400/200'),
  (1000028, 'https://picsum.photos/id/180/400/400'),
  (1000028, 'https://picsum.photos/id/192/600/400'),
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
