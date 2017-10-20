var mongoose = require('mongoose');

var schema = mongoose.Schema({
    room: {type: mongoose.Schema.ObjectId, ref: 'Room'},
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    date: Date,
    range: String,
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
