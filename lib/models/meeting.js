var mongoose = require('mongoose');

var schema = mongoose.Schema({
    openid: String,
    room: {type: mongoose.Schema.ObjectId, ref: 'Room'},
    meetingBegin: Date,
    meetingEnd: Date,
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

module.exports = mongoose.model('Meeting', schema);
