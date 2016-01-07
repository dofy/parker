var router = require('express').Router(),
    meeting = require('../models/meeting'),
    order = require('../models/order'),
    room = require('../models/room'),
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
                room.find().exec(function(err, result) {
                    res.render(page + cat, {
                        rooms: result,
                        isadmin: isadmin
                    });
                })
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

router.route('/room')
.post(function(req, res, next) {
    // add new room
    var name = req.body.name;
    room.findOneAndUpdate({
        name: name
    }, {
        name: name
    }, {
        new: true,
        upsert: true
    }, function(err, result) {
        console.log(err, result);
        $.result(res, result);
    });
});

router.route('/room/:id')
.get(function(req, res, next) {
    var roomid = req.params.id;
    room.findOne({_id: roomid}, function(err, resRoom) {
        if(err) {
            res.status(404).send('Room Not Found.');
        } else {
            meeting.find({room: roomid}, function(err, resMeeting) {
                res.render('manager-room', {
                    room: resRoom,
                    meetings: resMeeting
                });
            })
        }
    })
})
.delete(function(req, res, next) {
    // delete room and meeting
    var roomid = req.params.id;
    room.remove({_id: roomid}, function(err, result) {
        meeting.remove({room: roomid}, function(err, result) {
            if(err) {
                res.status(404).end();
            } else {
                res.status(200).end();
            }
        })
    });
});

module.exports = router;
