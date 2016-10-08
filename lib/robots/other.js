module.exports.getHelp = function(user, content, echo) {
    var help = [];
    help.push('这都被你发现了！！！😱😱');
    help.push('好吧，目前的功能有：订餐，订餐和订餐等各项功能……');
    help.push('你可以通过语音、文字或菜单与我交流，例如：');
    help.push('“订饭”');
    help.push('“午饭”');
    help.push('“订晚饭”');
    help.push('“我要订餐”');
    help.push('“取消订餐”');
    help.push('“我不订饭了”');
    help.push('“订饭查询”');
    help.push('“订餐状态”等');
    help.push('另外，为了避免每日提醒造成骚扰，你需要主动发送“订阅提醒”来开启提醒服务，发送“取消提醒”关闭提醒服务。');
    echo(help.join('\n'));
};
