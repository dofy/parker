var mongoose = require('mongoose'),
    $ = require('../utils');

var schema = mongoose.Schema({
    openid: String,
    appopenid: String,
    unionid: String,
    nickname: String,
    name: {
      type: String,
      index: true
    },
    sex: Number,
    language: String,
    city: String,
    province: String,
    country: String,
    headimgurl: String,
    isadmin: {type: Boolean, default: false},
    isguest: {type: Boolean, default: false},
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
    //console.log('>>>>>>> sync:', data.openid, data.unionid, data.nickname);
    if($.isEmpty(data.openid || data.unionid)) {
        return;
    }
    let who = {};
    if(data.openid) {
      // from wechat
        who.openid = data.openid;
    } else {
      // from weapp
        who.unionid = data.unionid;
    }
    this.findOneAndUpdate(who, data, {
        new: true,
        upsert: true
    }, callback);
};
