class InvalidArgumentError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
    this.name = "InvalidArgumentError";
  }
}

module.exports = InvalidArgumentError;
