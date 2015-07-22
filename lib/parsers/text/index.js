module.exports = function(data) {
    var content = data.Content;
    var dinnerReg = /.*[定订].*[饭餐].*/ig;
    if(content === '') {
        return '求表情包～～';
    } else if(dinnerReg.test(content)) {
        return require('../../robots/dinner')(data.FromUserName, content);
    } else {
        return content;
    }
};
