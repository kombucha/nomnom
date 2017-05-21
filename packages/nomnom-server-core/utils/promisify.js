module.exports = (fn, that) => (...args) =>
  new Promise((resolve, reject) => {
    fn.apply(that, [
      ...args,
      (err, value) => (err ? reject(err) : resolve(value))
    ]);
  });
