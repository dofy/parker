var mongo = require('mongoose');

module.exports.connect = function(url, callback) {
    mongo.connect(url, callback);
}
