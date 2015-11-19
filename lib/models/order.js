var mongoose = require('mongoose');

var schema = mongoose.Schema({
    from: String,
    type: Number, // 0: 午, 1: 晚
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
module.exports.addOne = function(user, type, callback) {
    var _ = this;
    getNow();
    _.findOne({from: user, type: type, added: {$gte: todayBegin}}, function(err, order) {
        if(order) {
            callback({addnew: false});
        } else {
            _.create({
                from: user,
                type: type
            }, function(err, order) {
                callback({addnew: true});
            });
        }
    });
};

module.exports.removeOne = function(user, type, callback) {
    getNow();
    this.findOne({
        from: user,
        type: type,
        added: {$gte: todayBegin}}, function(err, order) {
            if(order) {
                order.remove();
                callback({removed: true});
            } else {
                callback({removed: false});
            }
        });
};

module.exports.getList = function(type, callback) {
    var _ = this;
    getNow();
    _.find({type: type, added: {$gte: todayBegin}}, function(err, users) {
        callback(users);
    });
}

module.exports.getInfo = function(user, callback) {
    var _ = this;
    getNow();
    _.count({type: 0, added: {$gte: todayBegin}}, function(err, lCount) {
        _.count({type: 1, added: {$gte: todayBegin}}, function(err, dCount) {
            _.find({from: user, added: {$gte: todayBegin}}, function(err, orders) {
                callback({
                    lCount: lCount,
                    dCount: dCount,
                    orders: orders
                });
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
