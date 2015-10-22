var m = require('../models/alert');

module.exports = function(user, content, echo) {
    var cancelReg = /取消/ig;
    if(cancelReg.test(content)) {
        m.removeOne(user, function(info) {
            if(info.removed) {
                echo('已取消提醒订阅.');
            } else {
                echo('尚未订阅提醒.');
            }
        });
    } else {
        m.addOne(user, function(info) {
            if(info.addnew) {
                echo('提醒订阅成功.');
            } else {
                echo('已订阅过提醒.');
            }
        });
    }
};
