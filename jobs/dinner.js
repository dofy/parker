var $ = require('../lib/utils');
var m = require('../lib/models/alert');
var order = require('../models/order');

module.exports = {
    name: 'Dinner Alert',
    time: '0 0 14 * * 1-5',
    tick: alert
}

function alert() {
    m.getList(function(err, result) {
    //$.wechat.getUser(function(err, result) {
        var item, openid;
        //if(result.errcode){
        if(err) {
            //console.log(result);
            console.log(err);
            return;
        }
        //while(openid = result.data.openid.pop()) {
        while(item = result.pop()) {
            openid = item.from;
            order.hasOrder(openid, 1, function(info){
                info.has || pushAlert(info.user);
            });
        }
    });
}

function pushAlert(openid){
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
