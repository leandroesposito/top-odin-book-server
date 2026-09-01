# OdinBook API - Social Network Backend

A production-ready REST API for a social networking platform, built with **Node.js**, **Express**, **PostgreSQL**, and **Passport.js**. This backend powers a Facebook-style application with posts, friendships, messaging, and image uploads.

## Applied knowledge

- **Complete API Design** - RESTful endpoints for users, posts, comments, likes, friendships, and messaging
- **Database Design** - Complex PostgreSQL relationships with indexes for search performance
- **Authentication** - Session-based authentication with Passport.js and bcrypt password hashing
- **Input Validation** - Comprehensive express-validator chains with custom validators
- **Error Handling** - Custom error classes with centralized error middleware
- **Security** - Session management, CORS configuration, and protected routes
- **File Uploads** - Multer middleware for handling multipart/form-data with image validation
- **Cloud Storage** - Cloudinary integration for image hosting with automatic format conversion
- **Database Search** - PostgreSQL trigram similarity for fuzzy name search

## Live Demo

- **Frontend:** [https://top-odin-book-front.netlify.app](https://top-odin-book-front.netlify.app)
- **Backend:** Deployed on Render
- **Guest Login:** Click "Guest Login" on the frontend to explore instantly without creating an account

## Core Features

### Authentication & Accounts

- Username/password authentication using **Passport.js Local Strategy**
- Session-based auth with PostgreSQL session store
- Password hashing with **bcryptjs**
- Account creation with automatic profile generation
- Profile editing with avatar upload
- Account deletion with cascading cleanup
- Guest account with one-click demo login

### Posts

- Create posts with **text, images, or both** (never empty)
- Edit posts, add/remove images, edit/remove text
- Delete posts with Cloudinary image cleanup
- Like/unlike posts
- Text comments with delete functionality
- Pagination (`?page=1&limit=10`)
- Feed showing posts from friends + own posts

### Social Graph

- Send, accept, reject, and cancel friend requests
- Remove friends
- Public profiles viewable without friendship
- Friendship required for messaging and feed visibility
- Suggested friends (randomized)

### Messaging

- Direct messages with text, images, or both
- Chat history between friends
- Unread message counters per chat
- Last-seen tracking

### Search

- Fuzzy search by username or display name
- Typo-tolerant using **pg_trgm** (PostgreSQL trigram extension)
- Works with as few as 3 characters

### Notifications

- Pending friend request count
- Unread message count
- Lightweight endpoint for frontend sidebar badges

## Security Features

| Feature              | Implementation                                                    |
| -------------------- | ----------------------------------------------------------------- |
| **Password Hashing** | bcrypt with 10 salt rounds                                        |
| **Session Security** | HTTP-only signed cookies with `secure: true` and `sameSite: none` |
| **CORS**             | Whitelisted origins with credentials support                      |
| **Input Validation** | express-validator with custom validation chains                   |
| **SQL Injection**    | Parameterized queries with pg                                     |
| **File Size Limits** | Multer limits (512KB per image)                                   |
| **Route Protection** | `isAuthenticated()` middleware on protected routes                |

## Error Handling

Custom error classes provide consistent responses:

```javascript
{
  "success": false,
  "errors": ["Error message"]
}
```

- `InvalidArgumentError` (409) - validation failures
- `NotAuthorizedError` (401) - authentication/authorization failures
- `NotFoundError` (404) - resource not found

## Tech Stack

| Technology            | Purpose                  |
| --------------------- | ------------------------ |
| **Node.js**           | Runtime                  |
| **Express 5**         | Web framework            |
| **PostgreSQL**        | Database                 |
| **Passport.js**       | Authentication           |
| **express-session**   | Session management       |
| **connect-pg-simple** | PostgreSQL session store |
| **Multer**            | File upload handling     |
| **Cloudinary**        | Image hosting            |
| **express-validator** | Input validation         |
| **pg**                | PostgreSQL driver        |

## Project Structure

```

.
├── auth/         # Passport strategy & serialization
├── controllers/  # Route handlers with validation chains
├── db/           # Database queries and connection logic
├── errors/       # Custom error classes
├── routes/       # Express routers
├── index.js      # App entry point
└── package.json

```

## API Endpoints

### Authentication (`/api/auth`)

| Method   | Endpoint        | Description                        |
| -------- | --------------- | ---------------------------------- |
| `POST`   | `/sign-up`      | Create new account                 |
| `POST`   | `/log-in`       | Login with credentials             |
| `POST`   | `/log-in/guest` | Guest login (resets demo user)     |
| `POST`   | `/log-out`      | Logout current session             |
| `DELETE` | `/account`      | Delete account (cascades all data) |

### Profiles (`/api/profiles`)

| Method | Endpoint   | Description                         |
| ------ | ---------- | ----------------------------------- |
| `POST` | `/`        | Create profile (after signup)       |
| `PUT`  | `/`        | Update profile with image upload    |
| `GET`  | `/:userId` | Get user profile with friend status |

### Posts (`/api/posts`)

| Method   | Endpoint                       | Description                                                        |
| -------- | ------------------------------ | ------------------------------------------------------------------ |
| `POST`   | `/`                            | Create post with images (text + images, text only, or images only) |
| `GET`    | `/`                            | Get all posts with pagination                                      |
| `GET`    | `/feed`                        | Get friends' posts feed                                            |
| `GET`    | `/:postId`                     | Get single post                                                    |
| `PUT`    | `/:postId`                     | Edit post (add/remove images, edit text)                           |
| `DELETE` | `/:postId`                     | Delete post with images                                            |
| `POST`   | `/:postId/like`                | Like a post                                                        |
| `DELETE` | `/:postId/like`                | Remove like                                                        |
| `POST`   | `/:postId/comments`            | Add comment                                                        |
| `GET`    | `/:postId/comments`            | Get post comments                                                  |
| `DELETE` | `/:postId/comments/:commentId` | Delete comment                                                     |

### Users (`/api/users`)

| Method   | Endpoint                  | Description                         |
| -------- | ------------------------- | ----------------------------------- |
| `GET`    | `/search/:searchParam`    | Search users by name (fuzzy search) |
| `GET`    | `/me/friends-requests`    | Get sent/received friend requests   |
| `POST`   | `/:userId/send-request`   | Send friend request                 |
| `POST`   | `/:userId/accept-request` | Accept friend request               |
| `DELETE` | `/:userId/reject-request` | Reject friend request               |
| `DELETE` | `/:userId/cancel-request` | Cancel sent request                 |
| `GET`    | `/:userId/posts`          | Get user's posts                    |

### Friends (`/api/friends`)

| Method   | Endpoint     | Description                       |
| -------- | ------------ | --------------------------------- |
| `GET`    | `/`          | Get friends list with suggestions |
| `GET`    | `/suggested` | Get suggested users               |
| `GET`    | `/:userId`   | Get user's friends list           |
| `DELETE` | `/:userId`   | Remove friend                     |

### Messages (`/api/messages`)

| Method   | Endpoint        | Description                      |
| -------- | --------------- | -------------------------------- |
| `GET`    | `/`             | Get chat list with unread counts |
| `GET`    | `/user/:userId` | Get chat history                 |
| `POST`   | `/user/:userId` | Send message (text + images)     |
| `DELETE` | `/:messageId`   | Delete message                   |

### Notifications (`/api/notifications`)

| Method | Endpoint | Description                                                 |
| ------ | -------- | ----------------------------------------------------------- |
| `GET`  | `/`      | Get notification counts (friend requests + unread messages) |

## Key Design Decisions & Interesting Solutions

### 1. **Smart Post Validation with Emptyness Protection**

Posts can't be empty, validation checks text, new images, and existing images before allowing creation and updates:

```javascript
const hasText = body;
const hasNewPictures = files.length > 0;
const hasCurrentPicturesLeft = deletePictures.length < postPictures.length;
const isEmpty = !hasText && !hasNewPictures && !hasCurrentPicturesLeft;
```

This ensures data integrity by preventing empty posts during both creation and updates, while gracefully handling image deletion and replacement.

### 2. Password Validation with Complexity Requirements

```javascript
// controllers/validators.js
function validatePassword() {
  return body("password").custom((password) => {
    const pattern = RegExp(
      /(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[^a-zA-Z0-9]).{8}/,
    );
    if (!pattern.test(password)) {
      throw new InvalidArgumentError(
        "'password' must contain: at least 8 characters, 1 lowercase, " +
          "1 uppercase, 1 number and 1 symbol.",
      );
    }
    return true;
  });
}
```

Enforces strong password security with clear, actionable error messages for users.

### 3. Custom Error Classes with Status Codes

```javascript
// errors/InvalidArgumentError.js
class InvalidArgumentError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
    this.name = "InvalidArgumentError";
  }
}

// Centralized error handling middleware
app.use((error, req, res, next) => {
  const status = error.status || 500;
  let errors = [];

  if (req.locals?.errors) {
    errors = req.locals.errors;
  } else if (error.message) {
    errors = [error.message];
  } else if (error.errors) {
    errors = error.errors.map((err) => err.message);
  } else {
    errors = [error.name];
  }

  res.status(status).json({ success: false, errors });
});
```

Clean, consistent error responses with appropriate HTTP status codes make API debugging easier for frontend developers.

### 4. **Trigram Search for Fuzzy Matching**

Search uses PostgreSQL's `pg_trgm` extension with a GIST index:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX trgm_idx_profiles_name ON profiles USING GIST (name gist_trgm_ops);
```

This enables typo-tolerant search ("wonde" matches "Wonder") and partial matching with only 3 characters, improving UX significantly.

### 5. **Friendship Model with Ordered Pairs**

The `friends` table uses a `CHECK (user_id1 < user_id2)` constraint to prevent duplicate relationships:

```sql
CREATE TABLE friends (
  user_id1 integer REFERENCES users(id),
  user_id2 integer REFERENCES users(id),
  CONSTRAINT user_id2 CHECK (user_id1 < user_id2),
  PRIMARY KEY (user_id1, user_id2)
);
```

This means a friendship between user `1000000` and `1000007` can only be stored one way. Querying for friends requires checking both columns, but the constraint guarantees no duplicates.

### 6. **Lateral Joins for Efficient Counts**

Post queries use `LEFT JOIN LATERAL` to get like and comment counts without N+1 queries or expensive subqueries:

```sql
LEFT JOIN LATERAL (
  SELECT COUNT(*)::INTEGER as likes_count
  FROM likes
  WHERE post_id = posts.id
) lc ON true
```

PostgreSQL optimizes lateral joins well, they only execute for rows in the final result set (after LIMIT), not the entire table.

### 7. **Production Cookie Configuration**

Cross-origin cookies (Netlify frontend + Render backend) required specific configuration:

```javascript
app.set("trust proxy", 1); // Critical for Render's proxy

app.use(
  session({
    cookie: {
      sameSite: "none", // Cross-origin
      secure: true, // HTTPS only
    },
  }),
);
```

The `trust proxy` setting was a key piece, without it, Express thinks requests are HTTP and refuses to set `Secure` cookies.

### 8. **Guest User Reset Pattern**

The guest login feature deletes and recreates a demo user on each login:

```javascript
// Delete existing guest (cascades to all related data)
DELETE FROM users WHERE username = 'guest_user';

// Create fresh guest with sample data
INSERT INTO users ...
```

This ensures every guest session starts with the same clean state, showcasing all features without data accumulation.

### 9. Cascading Cleanup with ON DELETE CASCADE

```sql
-- Database schema with cascade deletion
CREATE TABLE posts (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  body TEXT,
  user_id integer REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE posts_pictures (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id integer REFERENCES posts(id) ON DELETE CASCADE,
  url TEXT,
  public_id TEXT
);

CREATE TABLE comments (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  body TEXT,
  post_id integer REFERENCES posts(id) ON DELETE CASCADE,
  user_id integer REFERENCES users(id) ON DELETE CASCADE
);
```

When a user deletes their account, a post or a message, all related data (posts, comments, likes, pictures, messages, friends, and friend requests) is automatically cleaned up without additional logic.

### 10. **Cloudinary Integration with Memory Storage**

Images upload directly from memory buffers (no disk storage needed):

```javascript
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.uploader.upload_stream(
  { format: "jpg" },
  (error, result) => { ... }
).end(file.buffer);

...

await pictureDB.uploadPostPicture(
  postId,
  uploadResult.url,
  uploadResult.public_id,
);
```

Cloudinary handles image optimization, format conversion, and CDN delivery automatically. The public_id allows later deletion when posts are removed.

### 11. Friend Request System with Validation Chain

```javascript
// controllers/validators.js
function friendRequestIsValid() {
  return param("userId").custom(async (userId, { req }) => {
    // Check if user already sent a request
    const sent = await friendRequestDB.getFriendRequest(req.user.id, userId);
    if (sent) {
      throw new InvalidArgumentError(
        "You have already sent a request to this user.",
      );
    }

    // Check if user already received a request
    const received = await friendRequestDB.getFriendRequest(
      userId,
      req.user.id,
    );
    if (received) {
      throw new InvalidArgumentError(
        "You already have a pending request from this user.",
      );
    }

    // Check if already friends
    const isFriend = await friendDB.getFriendsPair(userId, req.user.id);
    if (isFriend) {
      throw new InvalidArgumentError("You are already a friend of this user.");
    }

    return true;
  });
}
```

Prevents duplicate requests and race conditions with comprehensive validation.

## Running the Project

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Cloudinary account

### Installation

```bash
git clone <repo-url>
cd top-odin-book
npm install
```

### Environment Variables

Create `.env`:

```env
DEV_DATABASE_URL=postgresql://user:pass@localhost:5432/odinbook
SESSION_SECRET=your-secret-key
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

### Database Setup

```bash
# Create tables and seed sample data
node db/populate.js
```

### Run

```bash
node index.js
# Server runs on http://localhost:3000
```
