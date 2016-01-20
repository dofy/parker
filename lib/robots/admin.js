var t = require('../models/tempass'),
    u = require('../models/user');

module.exports = function(user, content, echo) {
    var code = Math.round(Math.random() * (9999 - 1000) + 1000);

    u.findOne({openid: user, isadmin: true}, function(err, result) {
        if(result) {
            t.findOneAndUpdate({
                openid: user
            }, {
                openid: user,
                code: code,
                added: new Date()
            }, {
                upsert: true
            }, function(err, result) {
                echo('登录密码：' + code + '，三分钟内有效。');
            });
        } else {
            echo('憋闹，你不是管理员！');
        }
    });
};
