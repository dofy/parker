var mongoose = require('mongoose');

var schema = mongoose.Schema({
    room: {type: mongoose.Schema.ObjectId, ref: 'Room'},
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    date: Date,
    range: Array,
    fromid: String,
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

module.exports.getRange = function (room, date, callback) {
  this.find({
    room, date
  }).select('range').exec((err, result) => {
    let range = [];
    result.forEach(item => {
      range = range.concat(item.range);
    })
    callback(err, range);
  })
};
