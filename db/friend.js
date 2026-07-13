const { runQuery } = require("./runQuery");

function sortParams(first, second) {
  return first < second ? [first, second] : [second, first];
}

async function addFriendsPair(user_id1, user_id2) {
  const [lower, higher] = sortParams(user_id1, user_id2);

  const query = `
    INSERT INTO friends (
      user_id1,
      user_id2
    ) VALUES (
      $1,
      $2
    ) RETURNING *;
  `;
  const params = [lower, higher];

  const res = await runQuery(query, params);
  return res[0];
}

async function getFriendsPair(user_id1, user_id2) {
  const [lower, higher] = sortParams(user_id1, user_id2);

  const query = `
    SELECT * FROM friends
    WHERE
      user_id1 = $1 AND
      user_id2 = $2;
  `;
  const params = [lower, higher];

  const res = await runQuery(query, params);
  return res[0];
}

async function deleteFriendsPair(user_id1, user_id2) {
  const [lower, higher] = sortParams(user_id1, user_id2);

  const query = `
    DELETE FROM friends
    WHERE
      user_id1 = $1 AND
      user_id2 = $2
    RETURNING *;
  `;
  const params = [lower, higher];

  const res = await runQuery(query, params);
  return res[0];
}

module.exports = {
  addFriendsPair,
  getFriendsPair,
  deleteFriendsPair,
};
