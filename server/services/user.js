const uuid = require("node-uuid");
const jwt = require("jsonwebtoken");
const config = require("../config");
const promisify = require("../utils/promisify");
const db = require("./db");

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

async function createUser(profile) {
  const user = {
    id: uuid.v4(),
    name: profile.name,
    email: profile.email,
    avatarUrl: profile.avatarUrl
  };

  await db.query(
    `INSERT INTO "nomnom"."User"("id", "name", "email", "avatarUrl") VALUES ($1, $2, $3, $4)`,
    [user.id, user.name, user.email, user.avatarUrl]
  );

  return user;
}

async function createToken(user) {
  return jwtSign({ userId: user.id }, config.jwt.secret, {
    algorithm: config.jwt.algorithm
  });
}

async function getById(id) {
  const res = await db.query(`SELECT * FROM "nomnom"."User" WHERE id = $1 LIMIT 1;`, [String(id)]);
  return res.rows[0];
}

async function getFromToken(token) {
  const payload = await jwtVerify(token, config.jwt.secret, {
    algorithms: [config.jwt.algorithm]
  });
  return getById(payload.userId);
}

async function getByEmail(email) {
  const res = await db.query(`SELECT * FROM "nomnom"."User" WHERE email = $1 LIMIT 1;`, [email]);
  return res.rows[0];
}

async function login(profile) {
  if (!profile.email) {
    throw new Error("An email is needed");
  }

  let user = await getByEmail(profile.email);

  if (!user) {
    user = await createUser(profile);
  }

  const token = await createToken(user);

  return {
    user,
    token
  };
}

module.exports = {
  createUser,
  login,
  getById,
  getFromToken
};
