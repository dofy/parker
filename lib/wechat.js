var snsurl, apiurl, appid, secret,
    accessToken, expires = 0,
    request = require('request');

exports = module.exports = init;

function init(options) {
    snsurl = options.snsurl;
    appid = options.appid;
    apiurl = options.apiurl;
    secret = options.secret;
}

function getOpenidByCode(code, callback) {
    request.get(snsurl, {
        qs: {
            grant_type: 'authorization_code',
            code: code,
            appid: appid,
            secret: secret
        }
    }, function(err, res, body) {
        var body = JSON.parse(body);
        callback && callback(body);
    });
}

function getAccessToken(next) {
    request.get(apiurl + 'token', {
        qs: {
            grant_type: 'client_credential',
            appid: appid,
            secret: secret
        }
    }, function(err, res, body) {
        var body = JSON.parse(body);
        accessToken = body.access_token;
        expires = +new Date() + body.expires_in * 1000;
        next && next();
    });
}

function checkAccessToken(next) {
    if(+new Date() >= expires) {
        getAccessToken(next);
    } else {
        next();
    }
}

// public functions
function getUserInfo(openid, callback) {
    checkAccessToken(function() {
        request.get(apiurl + 'user/info', {
            qs: {
                access_token: accessToken,
                openid: openid
            }
        }, function(err, res, body) {
            callback(err, JSON.parse(body));
        });
    })
}

function getUser(callback) {
    checkAccessToken(function() {
        request.get(apiurl + 'user/get', {
            qs: {
                access_token: accessToken
            }
        }, function(err, res, body) {
            callback(err, JSON.parse(body));
        });
    });
}

function sendByTemplate(openid, tmpid, data) {
    checkAccessToken(function() {
        request.post(apiurl + 'message/template/send', {
            qs: {
                access_token: accessToken
            },
            json: true,
            body: {
                touser: openid,
                template_id: tmpid,
                data: data
            }
        });
    });
}

function createMenu(menuConfig) {
    checkAccessToken(function() {
        request.post(apiurl + 'menu/create', {
            qs: {
                access_token: accessToken
            },
            json: true,
            body: menuConfig
        });
    });
}

exports.getUser = getUser;
exports.createMenu = createMenu;
exports.getUserInfo = getUserInfo;
exports.sendByTemplate = sendByTemplate;
exports.getOpenidByCode = getOpenidByCode;
