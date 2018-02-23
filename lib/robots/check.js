var u = require('../models/user');

module.exports = function(user, echo, next) {
  u.findOne({ openid: user, isguest: true }, function(err, result) {
    if (result) {
      echo('你séi啊？!');
    } else {
      next();
    }
  });
}
