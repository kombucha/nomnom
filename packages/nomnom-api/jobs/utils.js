// See https://github.com/OptimalBits/bull/issues/709
const getKeys = async (q, prefix = "*") => {
  const multi = q.multi();
  multi.keys(prefix);
  const keys = await multi.exec();
  return keys[0][1];
};

const deleteKeys = async (q, keys) => {
  const multi = q.multi();
  keys.forEach(k => multi.del(k));
  await multi.exec();
};

const removeAllJobs = async q => {
  const prefix = `${q.keyPrefix}:${q.name}*`;
  const keys = await getKeys(q, prefix);
  await deleteKeys(q, keys);
};

const removeRepeatableJobs = async q => {
  const prefix = `${q.keyPrefix}:${q.name}:repeat*`;
  const keys = await getKeys(q, prefix);
  await deleteKeys(q, keys);
};

module.exports = {
  removeAllJobs,
  removeRepeatableJobs
};
