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

var typeString, type, userData;
router.route('/:type')
.all(function(req, res, next) {
    typeString = ['上午', '下午'];
    type = req.params.type == 'am' ? 0 : 1;
    order.getList(type, function(users) {
        var currentUser, openids = [];
        while(currentUser= users.pop()) {
            openids.push(currentUser.from);
        }
        user.find({openid: {$in: openids}})
        .sort('nickname')
        .exec(function(err, result) {
            userData = result;
            next();
        });
    });
})
.post(function(req, res, next) {
    var userItem, arrContent = [];
    arrContent.push([$.moment().format('YYYY/MM/D'), typeString[type], '订餐列表'].join(' '));
    arrContent.push('------------------------');
    while(userItem = userData.pop()) {
        arrContent.push('口 ' + userItem.name || userItem.nickname);
    }
    if(arrContent.length)
        $.gugu.printpaper(arrContent);
    res.json({msg: 'ok'});
})
.get(function(req, res, next) {
    res.render('eatlist', {
        users: userData,
        tstr: typeString[type],
        typecat: req.params.type,
        today: $.moment().format('YYYY/MM/D')
    });
});

module.exports = router;
