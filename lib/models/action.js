var mongoose = require('mongoose');

var schema = mongoose.Schema({
    action: Number,
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    plus: {type: String, default: '{}'},
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

module.exports = mongoose.model('Action', schema);
