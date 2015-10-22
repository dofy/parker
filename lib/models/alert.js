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

module.exports = mongoose.model('Alert', schema);

// functions
module.exports.addOne = function(user, callback) {
    var _ = this;
    _.findOne({from: user}, function(err, alert) {
        if(alert) {
            callback({addnew: false});
        } else {
            _.create({
                from: user
            }, function(err, alert) {
                callback({addnew: true});
            });
        }
    });
};

module.exports.removeOne = function(user, callback) {
    this.findOne({from: user}, function(err, alert) {
        if(alert) {
            alert.remove();
            callback({removed: true});
        } else {
            callback({removed: false});
        }
    });
};

module.exports.getList = function(callback) {
    this.find().exec(callback);
}
