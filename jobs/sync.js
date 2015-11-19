var $ = require('../lib/utils');
var u = require('../lib/models/user');

module.exports = {
    name: 'Sync Users',
    time: '0 0 11 * * *',
    tick: sync
}

function sync() {
    $.wechat.getUser(function(err, result) {
        var openid;
        if(result.errcode){
            console.log(result);
            return;
        }
        while(openid = result.data.openid.pop()) {
            $.wechat.getUserInfo(openid, function(err, result) {
                u.sync(result, function(err, result) { });
            });
        }
    });
}
