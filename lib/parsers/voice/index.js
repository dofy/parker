module.exports = function(data, echo) {
    var content = data.Recognition;
    var eatReg = /.*[定订午晚]+.*[饭餐].*/ig;
    if(eatReg.test(content)) {
        require('../../robots/eat')(data.FromUserName, content, echo);
    } else {
        echo('说点我能听得懂的吧～');
    }
};
