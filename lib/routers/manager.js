var router = require('express').Router(),
    order = require('../models/order'),
    user = require('../models/user'),
    $ = require('../utils');

router.route('/')
.get(function(req, res, next) {
    $.wechat.getOpenidByCode(req.query.code, function(data) {
        req.session.fun = data.openid;
        res.redirect('/y/info');
    });
});

router.route('/:cat')
.get(function(req, res, next) {
    var cat = req.params.cat,
        page = 'manager-',
        isadmin = false,
        openid = req.session.fun;
    user.findOne({openid: openid}, function(err, result) {
        isadmin = result && result.isadmin;
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
                user.find({
                    openid: {$in: openids}
                })
                .sort('nickname')
                .exec(function(err, users) {
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
                user.find()
                .sort('nickname')
                .exec(function(err, result) {
                    res.render(page + cat, {
                        isadmin: isadmin,
                        users: result
                    });
                });
            break;
            case 'info':
            default:
                cat = 'info';
                res.render(page + cat);
            break;
        }
    });
});

router.route('/admin')
.post(function(req, res, next) {
    var myid = req.session.fun,
        data = req.body;
    user.findOne({openid: myid, isadmin: true}, function(err, result) {
        if(result) {
            user.findOneAndUpdate({
                openid: data.openid
            }, {
                isadmin: data.isadmin
            }, {
                new: true
            }, function(err, result) {
                res.json(err || result);
            });
        } else {
            res.status(403).send('Not admin!');
        }
    })
});

module.exports = router;
