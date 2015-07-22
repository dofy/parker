var mongoose = require('mongoose');

var schema = mongoose.Schema({
    from: String,
    added: {type: Date, default: Date.now}
}, {
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

schema.options.toObject.transform = function(doc, ret, options) {
    delete ret.id;
};

schema.options.toJSON.transform = function(doc, ret, options) {
    delete ret.id;
};

module.exports = mongoose.model('Order', schema);

// functions
module.exports.addOne = function(user, callback) {
    var _ = this;
    getNow();
    _.findOne({from: user, added: {$gte: todayBegin}}, function(err, order) {
        if(order) {
            callback({addnew: false});
        } else {
            _.create({from: user}, function(err, order) {
                callback({addnew: true});
            });
        }
    });
};

module.exports.removeOne = function(user, callback) {
    getNow();
    this.findOne({from: user, added: {$gte: todayBegin}}, function(err, order) {
        if(order) {
            order.remove();
            callback({removed: true});
        } else {
            callback({removed: false});
        }
    });
};

module.exports.getInfo = function(user, callback) {
    var _ = this;
    getNow();
    _.find({added: {$gte: todayBegin}}).count(function(err, count) {
        _.findOne({from: user, added: {$gte: todayBegin}}, function(err, order) {
            callback({
                count: count,
                hasOrder: !!order
            });
        });
    });
};

var todayBegin;
function getNow() {
    var now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth(),
        date = now.getDate();
    todayBegin = new Date(year, month, date);
}
