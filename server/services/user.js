const uuid = require("node-uuid");
const jwt = require("jsonwebtoken");
const N1qlQuery = require("couchbase").N1qlQuery;
const db = require("./couchbase");
const config = require("../config");
const promisify = require("../utils/promisify");

const DB_TYPE = "USER";
const generateId = () => `${DB_TYPE}::${uuid.v4()}`;

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

async function createUser(profile) {
  const id = generateId();
  const user = {
    name: profile.name,
    email: profile.email,
    avatarUrl: profile.avatarUrl
  };

  await db.insert(id, user);

  return Object.assign({ id }, user);
}

async function createToken(user) {
  return jwtSign({ userId: user.id }, config.jwt.secret, {
    algorithm: config.jwt.algorithm
  });
}

async function getById(id) {
  const res = await db.get(String(id));
  return Object.assign({ id }, res.value);
}

async function getFromToken(token) {
  const payload = await jwtVerify(token, config.jwt.secret, {
    algorithms: [config.jwt.algorithm]
  });
  return getById(payload.userId);
}

async function getByEmail(email) {
  const idLike = `${DB_TYPE}::%`;
  const query = N1qlQuery.fromString(
    `
    SELECT meta(t).id, t.*
    FROM \`nomnom\` as t
    WHERE meta(t).id LIKE $1
    AND t.email = $2
    `
  );

  const users = await db.query(query, [idLike, email]);
  return users[0];
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
