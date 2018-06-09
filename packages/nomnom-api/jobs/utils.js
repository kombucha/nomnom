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

/**
 * Send jobs to a non worker queue.
 * @param {Function} queueFactory
 * @param {object} job
 */
const performAsync = async (queueFactory, jobDefinitions) => {
  const queue = queueFactory(false);
  let results = [];
  let error;

  try {
    const jobs = await Promise.all(
      jobDefinitions.map(def => queue.add(def.name, def.data, def.options))
    );

    return Promise.all(jobs.map(job => job.finished()));
  } catch (e) {
    error = e;
  }

  await queue.close();

  if (error) {
    throw error;
  }

  return results;
};

const queueAsync = async (queueFactory, jobDefinitions) => {
  const queue = queueFactory(false);
  let error;
  let jobs;

  try {
    jobs = await Promise.all(jobDefinitions.map(def => queue.add(def.name, def.data, def.options)));
  } catch (e) {
    error = e;
  }

  await queue.close();
  if (error) {
    throw error;
  }

  return jobs;
};

module.exports = {
  performAsync,
  queueAsync,
  removeAllJobs,
  removeRepeatableJobs
};
