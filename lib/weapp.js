const request = require('request');
const config = require('./config').weapp;

module.exports = {
    getOpenId (code, callback) {
        request.get('https://api.weixin.qq.com/sns/jscode2session', {
            qs: {
                appid: config.appid,
                secret: config.secret,
                js_code: code,
                grant_type: 'authorization_code'
            }
        }, (err, res, body) => {
            callback && callback(JSON.parse(body));
        });
    }
};
