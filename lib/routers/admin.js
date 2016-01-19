var router = require('express').Router(),
    meeting = require('../models/meeting'),
    order = require('../models/order'),
    room = require('../models/room'),
    user = require('../models/user'),
    url = require('url'),
    $ = require('../utils');

router.route('/')
.get(function(req, res, next) {
    var code = req.query.code;
    if(code) {
        // oauth base
        $.wechat.getOpenidByCode(req.query.code, function(data) {
            // get user info
            user.findOne({openid: data.openid}, function(err, result) {
                // save user info
                req.session.fun = data.openid;
                req.session.isadmin = result && result.isadmin;
                res.redirect('/x/index');
            })
        });
    } else {
        // oauth
        var weconf = $.config.wechat,
            urlobj = url.parse(weconf.weburl);
        urlobj.query = {
            appid: weconf.web_appid,
            redirect_uri: url.format({
                protocol: req.protocol,
                host: req.hostname,
                pathname: req.originalUrl
            }),
            response_type: 'code',
            scope: 'snsapi_login'
        };
        urlobj.hash = 'wechat_redirect';
        res.redirect(url.format(urlobj));
    }
});

router.route('/index')
.get(function(req, res, next) {
    res.send(req.session.fun);
})

module.exports = router;
