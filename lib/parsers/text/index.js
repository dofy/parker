module.exports = function(data, echo) {
    var content = data.Content;
    var eatReg = /(.*[定订午晚]+.*[饭餐].*)|-?[12*]/ig;
    var alertReg = /(订阅|取消)提醒/ig;
    if(content === '') {
        echo('求表情包～～');
    } else if(['帮助', '求助', 'help'].indexOf(content.toLowerCase()) !== -1) {
        var help = [];
        help.push('这都被你发现了！！！😱😱');
        help.push('好吧，目前的功能有：订餐，订餐和订餐等各项功能……');
        help.push('你可以通过语音或输入文字进行操作，例如：');
        help.push('“订饭”');
        help.push('“午饭”');
        help.push('“订晚饭”');
        help.push('“我要订餐”');
        help.push('“取消订餐”');
        help.push('“我不订饭了”');
        help.push('“订饭查询”');
        help.push('“订餐状态”');
        help.push('随便试试吧，这是半睡半醒的时候开发的，难免有 bug，顺便给测测吧。 🙏');
        echo(help.join('\r\n'));
    } else if(alertReg.test(content)) {
        require('../../robots/alert')(data.FromUserName, content, echo);
    } else if(eatReg.test(content)) {
        require('../../robots/eat')(data.FromUserName, content, echo);
    } else {
        echo('我说“' + (Math.random() >= 0.5 ? '极客' : '公园') + '”你说“' + content + '”');
    }
};
