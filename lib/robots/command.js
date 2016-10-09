var u = require('../models/user'),
    job = require('../job');

module.exports = function(user, content, echo) {
    var cmd = content.toLowerCase();
    u.findOne({openid: user, isadmin: true}, function(err, result) {
        if(result) {
            switch (cmd) {
                case '/help':
                    var cmds = [];
                    cmds.push('/help - 命令列表');
                    cmds.push('/alun - 发送午餐提醒');
                    cmds.push('/adin - 发送晚餐提醒');
                    cmds.push('/stop - 停止工作日提醒服务');
                    cmds.push('/start - 开启工作日提醒服务');
                    echo(cmds.join('\n'));
                    break;
                case '/alun':
                    job.tick('lunch');
                    echo('已发送午餐提醒。');
                    break;
                case '/adin':
                    job.tick('dinner');
                    echo('已发送晚餐提醒。');
                    break;
                case '/stop':
                    job.stopOne('lunch');
                    job.stopOne('dinner');
                    echo('已停止工作日订餐提醒任务。');
                    break;
                case '/start':
                    job.startOne('lunch');
                    job.startOne('dinner');
                    echo('已开启工作日订餐提醒任务。');
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
