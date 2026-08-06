const { runQuery } = require("./runQuery");

async function getProfileByUserId(id) {
  const query = `
    SELECT p.*, COALESCE(p.name, u.username) as name,COUNT(f.user_id1) as friends_count
    FROM profiles p
    JOIN users u
      on u.id = p.user_id
    LEFT JOIN friends f
      ON (f.user_id1 =  p.user_id
        OR (f.user_id2 =  p.user_id))
    WHERE p.user_id = $1
    GROUP BY p.id, u.id
  `;
  const params = [id];

  const res = await runQuery(query, params);
  return res[0];
}

async function createProfile(
  { name, bio, birthdate, profession, profilePictureUrl },
  user_id,
) {
  const query = `
    INSERT INTO profiles (
      name ,bio ,birthdate ,profession ,profile_picture_url ,user_id
    ) VALUES (
      $1 ,$2 ,$3 ,$4 ,$5 ,$6
    ) RETURNING id;`;
  const params = [name, bio, birthdate, profession, profilePictureUrl, user_id];

  const res = await runQuery(query, params);
  return res[0];
}

async function updateProfile(
  { name, bio, birthdate, profession, profilePictureUrl },
  user_id,
) {
  let query = `
    UPDATE profiles SET
      name = $1,
      bio = $2,
      birthdate = $3,
      profession = $4,
      profile_picture_url = $5
    WHERE user_id = $6
    RETURNING id;`;
  let params = [name, bio, birthdate, profession, profilePictureUrl, user_id];

  if (!profilePictureUrl) {
    query = `
      UPDATE profiles SET
        name = $1,
        bio = $2,
        birthdate = $3,
        profession = $4
      WHERE user_id = $5
      RETURNING id;`;
    params = [name, bio, birthdate, profession, user_id];
  }

  const res = await runQuery(query, params);
  return res[0];
}

module.exports = {
  getProfileByUserId,
  createProfile,
  updateProfile,
};
