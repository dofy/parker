var router = require('express').Router(),
    order = require('../models/order'),
    user = require('../models/user'),
    $ = require('../utils');

// list of best
router.route('/')
.get(function(req, res, next) {
    res.redirect('z/am')
});

router.route('/:type')
.get(function(req, res, next) {
    var ts = ['上午', '下午'],
        t = req.params.type == 'am' ? 0 : 1;
    order.getList(t, function(users) {
        var u, openids = [];
        while(u= users.pop()) {
            openids.push(u.from);
        }
        user.find({openid: {$in: openids}}, function(err, users) {
            res.render('user', {
                users: users,
                tstr: ts[t],
                today: $.moment().format('YYYY/MM/D')
            });
        });
    });
});

module.exports = router;
