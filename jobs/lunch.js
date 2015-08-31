var $ = require('../lib/utils');

module.exports = {
    name: 'Lunch Alert',
    time: '0 0 10 * * 1-5',
    tick: alert
}

function alert() {
    $.wechat.getUser(function(err, result) {
        var openid;
        if(result.errcode){
            console.log(result);
            return;
        }
        while(openid = result.data.openid.pop()) {
            $.wechat.sendByTemplate(openid, $.config.wechat.template.alert, {
                first: {
                    value: '午餐提醒：'
                },
                schedule: {
                    value: '每日午餐提醒'
                },
                time: {
                    value: '每天 10:00 提醒一次'
                },
                remark: {
                    value: '别忘了订今天的午餐哦～'
                }
            });
        }
    });
}
