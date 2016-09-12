var text = require('../text/index.js');
module.exports = function(data, echo) {
    var content = data.Recognition;
    data.Content = content;
    text(data, echo);
};
