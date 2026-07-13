class NotAuthorizedError extends Error {
  constructor(message = "Not authorized.") {
    super(message);
    this.status = 401;
    this.name = "NotAuthorizedError";
  }
}

module.exports = NotAuthorizedError;
