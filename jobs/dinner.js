var $ = require('../lib/utils');

module.exports = {
    name: 'Dinner Alert',
    time: '0 0 14 * * 1-5',
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
                    value: '晚餐提醒：'
                },
                schedule: {
                    value: '每日晚餐提醒'
                },
                time: {
                    value: '每天 14:00 提醒一次'
                },
                remark: {
                    value: '别忘了订今天的晚餐哦～'
                }
            });
        }
    });
}
