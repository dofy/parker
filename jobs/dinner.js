var $ = require('../lib/utils');
var m = require('../lib/models/alert');
var order = require('../lib/models/order');

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
      value: 'Dinner reminder:'
    },
    schedule: {
      value: 'Daily dinner reminder'
    },
    time: {
      value: 'Daily reminder at 14:00'
    },
    remark: {
      value: 'Don\'t forget to reserve your dinner today!'
    }
  });
}
