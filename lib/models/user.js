var mongoose = require('mongoose'),
    $ = require('../utils');

var schema = mongoose.Schema({
    openid: String,
    nickname: String,
    name: String,
    sex: Number,
    language: String,
    city: String,
    province: String,
    country: String,
    headimgurl: String,
    isadmin: {type: Boolean, default: false},
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

module.exports = mongoose.model('User', schema);

//functions
module.exports.sync = function(data, callback) {
    if($.isEmpty(data.openid)) {
        return;
    }
    this.findOneAndUpdate({
        openid: data.openid
    }, data, {
        new: true,
        upsert: true
    }, callback);
};
