var $ = require('../../utils');
var check = require('../../robots/check');
var mUser = require('../../models/user');

module.exports = function (data, echo) {
    var user = data.FromUserName;
    var content = data.Content.trim();
    var eatReg = /(?:.*[定订午晚]+.*[饭餐].*)|(?:.*全.*[天部].*)/ig;
    var alertReg = /(?:订阅|取消)提醒/ig;
    var helpReg = /[帮求]助|help/ig;
    var cmdReg = /^\/\w{4,5}$/;
    if ('admin' === content.toLowerCase()) {
      check(user, echo, function() {
        require('../../robots/admin')(user, content, echo);
      });
    } else if ('升级' === content.toLowerCase()) {
      $.wechat.getUserInfo(user, function(err, result) {
          mUser.sync(result, function(err, result) {
            if (err) {
              console.log(err);
              echo('升级失败... 💔');
            } else {
              echo('升级成功 ✌️');
            }
          });
      });
    } else if ('礼物' === content.toLowerCase()) {
        // require('../../robots/actions/gifts')('2016', user, content, echo);
      check(user, echo, function() {
        require('../../robots/actions/gifts')('2017', user, content, echo);
      });
    } else if (cmdReg.test(content)) {
        require('../../robots/command')(user, content, echo);
    } else if (helpReg.test(content)) {
      check(user, echo, function() {
        require('../../robots/other').getHelp(user, content, echo);
      });
    } else if (alertReg.test(content)) {
        require('../../robots/alert')(user, content, echo);
    } else if (eatReg.test(content)) {
      check(user, echo, function() {
        require('../../robots/eat')(user, content, echo);
      });
    } else {
      //check(user, echo, function() {
        // require('../../robots/address')(user, content, echo);
        // echo('我说“' + (Math.random() >= 0.5 ? '极客' : '公园') + '”你说“' + content + '”');
      //});
      echo('¯\\_(ツ)_/¯');
    }
};
