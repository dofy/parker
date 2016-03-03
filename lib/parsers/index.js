module.exports = function (data, echo) {
    switch (data.MsgType) {
        case 'text':
            require('./text')(data, echo);
            break;
        case 'voice':
            require('./voice')(data, echo);
            break;
        case 'event':
            require('./event')(data, echo);
            break;
        default:
            echo('瘪整没用的，说国语！');
    }
};
