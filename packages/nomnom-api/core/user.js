const uuid = require("node-uuid");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const db = require("./db");

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ALGORITHM = process.env.JWT_ALGORITHM;

async function createUser(profile) {
  const user = {
    id: uuid.v4(),
    name: profile.name,
    email: profile.email,
    avatarUrl: profile.avatarUrl
  };

  await db("User").insert(user);

  return user;
}

async function createToken(user, roles) {
  return jwtSign({ userId: user.id, roles }, JWT_SECRET, {
    algorithm: JWT_ALGORITHM
  });
}

async function getTokenPayload(token) {
  return jwtVerify(token, JWT_SECRET, {
    algorithms: [JWT_ALGORITHM]
  });
}

async function getById(id) {
  const user = await db("User")
    .where("id", id)
    .first();

  return user;
}

async function getByEmail(email) {
  const user = await db("User")
    .where("email", email)
    .first();

  return user;
}

async function login(profile) {
  if (!profile.email) {
    throw new Error("An email is needed");
  }

  let user = await getByEmail(profile.email);

  if (!user) {
    user = await createUser(profile);
  }

  const token = await createToken(user, ["login"]);

  return {
    user,
    token
  };
}

module.exports = {
  createUser,
  login,
  getById,

  createToken,
  getTokenPayload
};
