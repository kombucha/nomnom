const uuid = require("node-uuid");
const db = require("./couchbase");

const DB_TYPE = "USER";
const generateId = () => `${DB_TYPE}::${uuid.v4()}`;

async function createUser(profile) {
  const id = generateId();
  const user = {
    name: profile.name,
    email: profile.email
  };

  await db.insert(id, user);

  return Object.assign({ id }, user);
}

async function getById(id) {
  const res = await db.get(String(id));
  return Object.assign({ id }, res.value);
}

module.exports = {
  createUser,
  getById
};
