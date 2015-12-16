var order = require('../models/order');

module.exports = function(user, content, echo) {
    var cancelReg = /(.*(别|禁|不|取消).*[定订午晚]+.*[饭餐].*)|-[12]/ig;
    var statusReg = /([定订][饭餐](状态|查询))|*/ig;
    var types = ['午', '晚'];
    var lunchReg = /午|1/ig;
    var dinnerReg = /晚|2/ig;
    var reInfo = [];

    var now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth(),
        date = now.getDate(),
        hour = now.getHours(),
        min = now.getMinutes(),
        lunchEndTime = new Date(year, month, date, 10),
        dinnerEndTime = new Date(year, month, date, 15),
        endTime, isOver, eatType;

    if(lunchReg.test(content)) {
        eatType = 0;
        endTime = lunchEndTime;
    } else if(dinnerReg.test(content)) {
        eatType = 1;
        endTime = dinnerEndTime;
    } else {
        if(now < lunchEndTime) {
            eatType = 0;
            endTime = lunchEndTime;
        } else {
            eatType = 1;
            endTime = dinnerEndTime;
        }
    }

    isOver = now > endTime;

    if(cancelReg.test(content)) {
        if(isOver) {
            echo(types[eatType] + '餐结束了，不能取消了，尽量吃吧！ 😂😂😂');
        } else {
            order.removeOne(user, eatType, function(info) {
                if(info.removed) {
                    echo('好的，' + types[eatType] + '餐已经取消了～');
                } else {
                    echo('别闹！你还没订' + types[eatType] + '餐呢！');
                }
            });
        }
    } else if(statusReg.test(content)) {
        order.getInfo(user, function(info) {
            reInfo.push('>>> 订餐状态 <<<');
            if(isOver) {
                reInfo.push('订餐已结束');
            }
            reInfo.push('午餐人数：' + info.lCount);
            reInfo.push('晚餐人数：' + info.dCount);
            if(info.orders.length) {
                if(info.orders.length >= 2) {
                    reInfo.push('我订了午餐和晚餐 🐷');
                } else {
                    reInfo.push('我订了' + (info.orders[0].type === 0 ? '午' : '晚') + '餐 ✌️');
                }
            } else {
                reInfo.push('我没订餐 😫');
            }
            echo(reInfo.join('\r\n'));
        });
    } else {
        if(isOver) {
            echo(types[eatType] + '餐结束了，明日赶早！🔚')
        } else {
            order.addOne(user, eatType, function(info) {
                if(info.addnew) {
                    echo(types[eatType] + '餐已订好啦，一会咪西吧～ 🍚');
                } else {
                    echo(types[eatType] + '餐已经订过了，咋害订呢！！🐷');
                }
            });
        }
    }
};
