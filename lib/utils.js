var crypto = require('crypto'),
    log4js = require('log4js'),
    config = require('./config'),
    wechat = require('./wechat'),
    weapp = require('./weapp'),
    gugu = require('./gugu');

log4js.configure(config.log, {});

module.exports = log4js.getLogger('debug');
module.exports.logAccess = log4js.connectLogger(log4js.getLogger('access'), {
    level: 'auto'
});

module.exports.md5 = function(str) {
    return crypto.createHash('md5').update(str.toString()).digest('hex');
};

module.exports.base64 = function(str) {
    return Buffer(str.toString()).toString('base64');
};

gugu(config.gugu);
module.exports.gugu = gugu;

// wechat api
wechat(config.wechat);
module.exports.wechat = wechat;

// wechat app api
module.exports.weapp = weapp;

module.exports.path = require('path');

/**
 * 生成 API 返回数据
 * @param   res     response
 * @param   data    返回数据 （code===0:数据体, code>0:error message)
 * @param   code    Error Code (default: 0)
 * @param   status  Status Code (default: 200)
 */
module.exports.result = function(res, data, code, status) {
    var redata = {};
    if (typeof data === 'string') {
        // error
        code = code || 999;
        status = status || 400;
        redata = {
            code: code,
            error: data
        };
    } else {
        // data
        code = code || 0;
        status = status || 200;
        if (data.toObject)
            data = data.toObject();
        data.code = code;
        redata = data;
    }
    res.status(status).jsonp(redata);
};

module.exports.isTrue = function(value) {
    if(typeof value === 'boolean') {
        return value;
    } else if(typeof value === 'string') {
        return '1 true yes ok'.split(' ').indexOf(value.trim().toLowerCase()) !== -1;
    } else {
        return !!value;
    }
};

module.exports.isEmpty = function(value) {
    if(typeof value == 'string') {
        return value.trim() === '';
    } else if(typeof value == 'number') {
        return value === 0;
    } else {
        return value === null || value === undefined;
    }
};

// error code
module.exports.errCode = require('./errorCode.json');

// moment
module.exports.moment = require('moment');

module.exports.mongo = require('./mongo');

module.exports.file = require('./file');
module.exports.fileCache = require('./fileCache');

module.exports.config = config;
