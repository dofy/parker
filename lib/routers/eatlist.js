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
    var tempLine, tempLength;
    arrContent.push([$.moment().format('YYYY/MM/D'), typeString[type], '订餐列表'].join(' '));
    arrContent.push('------------------------');
    while(userItem = userData.pop()) {
        if(!tempLine) {
            tempLine = '[  ] ' + userItem.name || userItem.nickname;
            tempLength = tempLine.length * 2 - 4;
            if(userData.length === 0) {
                arrContent.push(tempLine);
            }
        } else {
            tempLine += fillSpace(tempLength) + '[  ] ' + userItem.name || userItem.nickname;
            arrContent.push(tempLine);
            tempLine = '';
        }
    }
    if(arrContent.length)
        $.gugu.printpaper(arrContent);
    res.json({msg: 'ok'});

    // functions
    function fillSpace(len) {
        var arr;
        len = Math.max(0, 15 - len);
        arr = new Array(len);
        return arr.join(' ');
    }
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
