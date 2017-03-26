const user = require("./services/user");

module.exports = () =>
  (req, res, next) => {
    // Fake it til you make it !
    const id = "USER::first-user";

    user.getById(id).then(
      user => {
        req.user = user;
        next();
      },
      err => {
        console.log(err);
        next(err);
      }
    );
  };
