var order = require('../models/order');

module.exports = function(user, content, echo) {
    var cancelReg = /.*(别|禁|不|取消).*[定订].*[饭餐].*/ig;
    var statusReg = /[定订][饭餐](状态|查询)/ig;

    var now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth(),
        date = now.getDate(),
        hour = now.getHours(),
        min = now.getMinutes(),
        endTime = new Date(year, month, date, 16),
        isOver = now > endTime;

    var reInfo = [];

    if(cancelReg.test(content)) {
        if(isOver) {
            echo('结束了，不能取消了，尽量吃吧！ 😂😂😂');
        } else {
            order.removeOne(user, function(info) {
                if(info.removed) {
                    echo('好的，已经取消了～');
                } else {
                    echo('别闹！你还没订呢！');
                }
            });
        }
    } else if(statusReg.test(content)) {
        order.getInfo(user, function(info) {
            reInfo.push('>>> 订餐状态 <<<');
            if(isOver) {
                reInfo.push('订餐已结束');
            }
            reInfo.push('订餐人数：' + info.count);
            reInfo.push(info.hasOrder ? '我订餐了 😄' : '我没订餐 😫');
            echo(reInfo.join('\r\n'));
        });
    } else {
        if(isOver) {
            echo('订餐结束了，明日赶早！🔚')
        } else {
            order.addOne(user, function(info) {
                if(info.addnew) {
                    echo('饭已订好啦，一会咪西吧～ 🍚');
                } else {
                    echo('已经订过了，咋害订呢！！🐷');
                }
            });
        }
    }
};
