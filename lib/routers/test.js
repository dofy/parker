var router = require('express').Router(),
    user = require('../models/user'),
    $ = require('../utils');

// list of best
router.route('/')
.get(function(req, res, next) {
    $.wechat.getUserInfo('oxBgYv4ijMbVtet9q2Sv6QDERrv4', function(err, result) {
        user.sync(result, function(err, result) {
            console.log(result);
            $.result(res, {msg: 'OK'});
        });
    });
});

module.exports = router;
