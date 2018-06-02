/**
 * Send jobs to a non worker queue.
 * @param {Function} queueFactory
 * @param {object} job
 */
async function performAsync(queueFactory, jobDefinitions) {
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
}

module.exports = performAsync;
