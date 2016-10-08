var u = require('../models/user'),
    job = require('../job');

module.exports = function(user, content, echo) {
    var cmd = content.toLowerCase();
    u.findOne({openid: user, isadmin: true}, function(err, result) {
        if(result) {
            switch (cmd) {
                case '/hlp':
                    var cmds = [];
                    cmds.push('/hlp - 命令列表');
                    cmds.push('/alu - 发送午餐提醒');
                    cmds.push('/adi - 发送晚餐提醒');
                    echo(cmds.join('\n'));
                    break;
                case ':alu':
                    job.tick('lunch');
                    echo('已发送午餐提醒。');
                    break;
                case ':adi':
                    job.tick('dinner');
                    echo('已发送晚餐提醒。');
                    break;
                default:
                    echo('未知命令。');
                    break;
            }
        } else {
            echo('憋闹，你不是管理员！');
        }
    });
};
