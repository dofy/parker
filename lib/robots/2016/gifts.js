var a = require('../../models/action'),
    u = require('../../models/user');

module.exports = function(action, user, content, echo) {
    var result = [];
    u.findOne({
        openid: user
    }, function(err, me) {
        console.log(me);
        a.findOne({
            action: action,
            user: me._id
        })
        .populate([
            {path: 'plus.from', model: 'User'},
            {path: 'plus.to', model: 'User'}
        ])
        .exec(function(err, myact) {
            if(myact) {
                result.push('你要送礼物给' + (myact.plus.to.name || myact.plus.to.nickname) + '。');
                //result.push('同时你会收到来自' + (myact.plus.from.name || myact.plus.from.nickname) + '的礼物。');
                echo(result.join('\n'));
            } else {
                echo('没找到交换礼物的人 :(');
            }
        });
    });
};
