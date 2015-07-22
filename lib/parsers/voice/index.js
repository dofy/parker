module.exports = function(data, echo) {
    var content = data.Recognition;
    var dinnerReg = /.*[定订].*[饭餐].*/ig;
    if(dinnerReg.test(content)) {
        require('../../robots/dinner')(data.FromUserName, content, echo);
    } else {
        echo('说点我能听得懂的吧～');
    }
};
