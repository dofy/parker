var router = require('express').Router(),
    order = require('../models/order'),
    user = require('../models/user'),
    $ = require('../utils');

router.route('/')
.get(function(req, res, next) {
    res.redirect('/y/info');
});

router.route('/:cat')
.get(function(req, res, next) {
    var cat = req.params.cat,
        page = 'manager-';
    switch (cat) {
        case 'eatlist':
            var now = new Date(),
                typeString = ['上午', '下午'],
                type = req.query.type || (now.getHours() < 12 ? '0' : '1');
            order.getList(type, function(users) {
                var currentUser, openids = [];
                while(currentUser = users.pop()) {
                    openids.push(currentUser.from);
                }
                user.find({openid: {$in: openids}}, function(err, users) {
                    res.render(page + cat, {
                        users: users,
                        tstr: typeString[type],
                        today: $.moment().format('YYYY/MM/D')
                    });
                });
            });
        break;
        case 'meeting':
            res.render(page + cat);
            break;
        case 'users':
            res.render(page + cat);
            break;
        case 'info':
        default:
            cat = 'info';
            res.render(page + cat);
            break;
    }
});

module.exports = router;
