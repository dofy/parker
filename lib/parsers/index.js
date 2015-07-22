module.exports = function(data) {
    switch(data.MsgType) {
        case 'text':
            return require('./text')(data);
            break;
        case 'voice':
            return require('./voice')(data);
            break;
        default:
            return '瘪整没用的，说国语！';
    }
};
