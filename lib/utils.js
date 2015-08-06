var crypto = require('crypto'),
    log4js = require('log4js'),
    config = require('./config'),
    wechat = require('./wechat');

log4js.configure(config.log, {});

module.exports = log4js.getLogger('debug');
module.exports.logAccess = log4js.connectLogger(log4js.getLogger('access'), {
    level: 'auto'
});

module.exports.md5 = function(str) {
    return crypto.createHash('md5').update(str.toString()).digest('hex');
};

wechat(config.wechat);
module.exports.wechat = wechat;

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
        if (code > 0) {
            if (data.toObject)
                data = data.toObject();
            data.code = code;
        }
        redata = data;
    }
    res.status(status).jsonp(redata);
};

// error code
module.exports.errCode = require('./errorCode.json');

module.exports.mongo = require('./mongo');

module.exports.file = require('./file');
module.exports.fileCache = require('./fileCache');

module.exports.config = config;
