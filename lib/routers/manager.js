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
                res.redirect('/y/info');
            })
        });
    } else {
        // oauth
        var weconf = $.config.wechat,
            urlobj = url.parse(weconf.reurl);
        urlobj.query = {
            appid: weconf.appid,
            redirect_uri: url.format({
                protocol: req.protocol,
                host: req.hostname,
                pathname: req.originalUrl
            }),
            response_type: 'code',
            scope: 'snsapi_base'
        };
        urlobj.hash = 'wechat_redirect';
        res.redirect(url.format(urlobj));
    }
});

// pages
router.route('/eatlist')
.get(function(req, res, next) {
    var openid = req.session.fun,
        now = new Date(),
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
            res.render('manager-eatlist', {
                users: users,
                tstr: typeString[type],
                today: $.moment().format('YYYY/MM/D')
            });
        });
    });
});

router.route('/meeting')
.get(function(req, res, next) {
    var isadmin = !!req.session.isadmin;
    console.log(isadmin, req.session);
    room.find().exec(function(err, result) {
        res.render('manager-meeting', {
            rooms: result,
            isadmin: isadmin
        });
    });
});

router.route('/users')
.get(function(req, res, next) {
    var isadmin = !!req.session.isadmin;
    user.find().sort('nickname')
    .exec(function(err, result) {
        res.render('manager-users', {
            isadmin: isadmin,
            users: result
        });
    });
});

router.route('/info')
.get(function(req, res, next) {
    res.render('manager-info');
});

// functions
router.route('/admin')
.post(function(req, res, next) {
    var myid = req.session.fun,
        isadmin = !!req.session.isadmin,
        data = req.body;
    if(isadmin) {
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
        $.result(res, 'Not admin!', 403);
    }
});

router.route('/room')
.post(function(req, res, next) {
    // add new room
    var name = req.body.name,
        isadmin = !!req.session.isadmin;
    if(isadmin) {
        room.findOneAndUpdate({
            name: name
        }, {
            name: name
        }, {
            new: true,
            upsert: true
        }, function(err, result) {
            $.result(res, result);
        });
    } else {
        $.result(res, 'Not admin!', 403);
    }
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
    var roomid = req.params.id,
        isadmin = !!req.session.isadmin;
    if(isadmin) {
        room.remove({_id: roomid}, function(err, result) {
            meeting.remove({room: roomid}, function(err, result) {
                if(err) {
                    res.status(404).end();
                } else {
                    res.status(200).end();
                }
            })
        });
    } else {
        res.status(403).end();
    }
});

// router.route('/a/:b')
// .get(function(req, res, next) {
//     req.session.isadmin = !!parseInt(req.params.b);
//     res.send(req.session);
// });

module.exports = router;
