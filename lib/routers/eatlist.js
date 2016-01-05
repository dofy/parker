var router = require('express').Router(),
    order = require('../models/order'),
    user = require('../models/user'),
    $ = require('../utils');

// list of best
router.route('/')
.get(function(req, res, next) {
    var url = 'z/',
        now = new Date();
    url += now.getHours() < 12 ? 'am' : 'pm';
    res.redirect(url);
});

router.route('/:type')
.get(function(req, res, next) {
    var typeString = ['上午', '下午'],
        type = req.params.type == 'am' ? 0 : 1;
    order.getList(type, function(users) {
        var currentUser, openids = [];
        while(currentUser= users.pop()) {
            openids.push(currentUser.from);
        }
        user.find({openid: {$in: openids}}, function(err, users) {
            res.render('eatlist', {
                users: users,
                tstr: typeString[type],
                today: $.moment().format('YYYY/MM/D')
            });
        });
    });
});

module.exports = router;
