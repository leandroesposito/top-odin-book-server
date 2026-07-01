const bcrypt = require("bcryptjs");

const passwords = ["palice123"];

const hashedPasswords = [
  "$2b$10$6knqmuiWErv45iIBPr.fced4ZofonLDM9aDjA7mcQv7KKCHGLl3cS",
];

const query = `
INSERT INTO users (username, password) VALUES
  ('alice123', '${hashedPasswords[0]}');
`;

async function insertData(client) {
  await client.query(query);
}

module.exports = { insertData };
