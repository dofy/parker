var order = require('../models/order');

module.exports = function(user, content) {
    var cancelReg = /.*(不|取消).*[定订饭餐]+.*/ig;
    var statusReg = /[定订][饭餐](状态|查询)/ig;

    var now = new Date();
    order.find({}, function(err, result) {
        console.log(now, result);
    });
    if(cancelReg.test(content)) {
        return '好的，已经取消了～ (' + user + ')';
    } else if(statusReg.test(content)) {
        return '目前订餐状态是：(' + user + ')';
    } else {
        return '饭已OK啦，下来咪西吧～ (' + user + ')';
    }
};
