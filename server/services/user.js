const uuid = require("node-uuid");
const db = require("../couchbase");

const DB_TYPE = "USER";
const generateId = () => `${DB_TYPE}::${uuid.v4()}`;

function createUser(profile) {
  const id = generateId();
  const user = {
    name: profile.name,
    email: profile.email
  };

  return db.insert(id, user).then(() => Object.assign({ id }, user));
}

function getById(id) {
  return db.get(String(id)).then(res => Object.assign({ id }, res.value));
}

module.exports = {
  createUser,
  getById
};
