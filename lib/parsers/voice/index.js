module.exports = function(data) {
    var content = data.Recognition;
    var dinnerReg = /.*[定订].*[饭餐].*/ig;
    if(dinnerReg.test(content)) {
        return require('../../robots/dinner')(data.FromUserName, content);
    } else {
        return '说点我能听得懂的吧～';
    }
};
