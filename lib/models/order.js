var mongoose = require('mongoose');

var schema = mongoose.Schema({
    from: String,
    type: Number, // 0: 普通, 1: 卤肉饭
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
    _.findOne({from: user, added: {$gte: todayBegin}}, function(err, order) {
        if(order) {
            if(order.type !== type) {
                order.type = type;
                order.save(function(err, result) {
                    callback({addnew: false, changed: true});
                });
            } else {
                callback({addnew: false, changed: false});
            }
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
    _.count({added: {$gte: todayBegin}}, function(err, count) {
        _.count({type: 2, added: {$gte: todayBegin}}, function(err, vCount) {
            _.findOne({from: user, added: {$gte: todayBegin}}, function(err, order) {
                callback({
                    count: count,
                    vCount: vCount,
                    order: order,
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
