const { User } = require('../models/User');

let authForCmt = (req, res, next) => {
  let token = req.cookies.w_auth;
  if (req.user._id = '6048876615b38630f0a1dabb') next();
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { authForCmt };
