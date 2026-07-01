const usersDB = require("../db/users");

async function serializeUser(user, done) {
  done(null, user.id);
}

async function deserializeUser(userId, done) {
  try {
    const user = await usersDB.getUserById(userId);
    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
}

module.exports = {
  serializeUser,
  deserializeUser,
};
