var mongoose = require('mongoose');

var schema = mongoose.Schema({
    geekid: {
        type: String
    },
    name: {
        type: String,
        index: true
    },
    phoneNumber: {
        type: String,
        index: true
    },
    email: {
        type: String,
        index: true
    },
    department: {
        type: String,
        index: true
    },
    fesco: {
        type: String,
        index:true
    },
    added: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

schema.options.toObject.transform = function (doc, ret, options) {
    delete ret.id;
};

schema.options.toJSON.transform = function (doc, ret, options) {
    delete ret.id;
};

module.exports = mongoose.model('Address', schema);

module.exports.findAddress = function (content, callback) {
    var find = {
        '$or': [{
            'name': { '$regex': content }
        }, {
            'phoneNumber': { '$regex': content }
        }, {
            'email': { '$regex': content }
        }, {
            'department': { '$regex': content }
        }]
    };
    this.find(find)
        .exec(callback);
};
