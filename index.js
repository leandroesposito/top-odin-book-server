require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");

const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool");
const passport = require("passport");
const LocalStrategy = require("./auth/Strategy");
const serializations = require("./auth/serializations");

const InvalidArgumentError = require("./errors/InvalidArgumentError");

const indexRouter = require("./routes/index");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  }),
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    store: new pgSession({ pool, createTableIfMissing: true }),
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

passport.use(LocalStrategy);
passport.serializeUser(serializations.serializeUser);
passport.deserializeUser(serializations.deserializeUser);

app.use("/api", indexRouter);

app.use((error, req, res, next) => {
  console.error(new Date().toLocaleString(), error);
  const status = Object.hasOwn(error, "status") ? error.status : 500;
  const errors = req.locals?.errors || [error.message] || [error.name];

  res.status(status).json({ success: false, errors });
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log("Server running on port", PORT);
});
