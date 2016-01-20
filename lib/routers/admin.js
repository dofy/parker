var router = require('express').Router(),
    actions = require('../config/actions'),
    tempass = require('../models/tempass'),
    action = require('../models/action'),
    user = require('../models/user'),
    url = require('url'),
    $ = require('../utils');

router.route('/')
.get(function(req, res, next) {
    if(!req.session.fun) {
        user.find({isadmin: true}, function(err, result) {
            res.render('admin-login', {users: result});
        });
    } else {
        res.redirect('/x/index');
    }
})
.post(function(req, res, next) {
    var openid = req.body.openid,
        code = req.body.code,
        now = +new Date();
    tempass.findOne({openid: openid}, function(err, result) {
        if(result) {
            if(result.code !== code) {
                $.result(res, {msg: '错误的登录码。'}, 403);
            } else if(now - result.added > 3 * 60 * 1000) {
                $.result(res, {msg: '登录码已过期。'}, 403);
            } else {
                req.session.fun = openid;
                $.result(res, {msg: '登录成功。'});
            }
        } else {
            $.result(res, {msg: '登录失败！'}, 403);
        }
    });
});

router.route(['/:cat', '/:cat/:id'])
.get(function(req, res, next) {
    if(!req.session.fun) {
        res.redirect('/x');
    } else {
        next();
    }
})
.post(function(req, res, next){
    if(!req.session.fun) {
        $.result(res, {msg: 'Please Login!'}, 403);
    } else {
        next();
    }
});

router.route('/logout')
.get(function(req, res, next) {
    req.session.destroy(function(err) {
        res.redirect('/x');
    });
});

router.route('/index')
.get(function(req, res, next) {
    res.redirect('/x/users');
});

router.route('/users')
.get(function(req, res, next) {
    user.find()
        .sort("nickname")
        .exec(function(err, result) {
            res.render('admin-users', {users: result});
        });
})
.post(function(req, res, next) {
    var id = req.body.id,
        name = req.body.name.trim(),
        isadmin = $.isTrue(req.body.isadmin);
    user.findOneAndUpdate({
        _id: id
    }, {
        name: name,
        isadmin: isadmin
    }, function(err, result) {
        if(result) {
            $.result(res, {id: id, msg: 'ok'});
        } else {
            $.result(res, {id: id, msg: err.message}, 404);
        }
    });
});

router.route('/actions')
.get(function(req, res, next) {
    // get actions list
    res.render('admin-actions.jade', {actions: actions});
});

router.route('/actions/:id')
.get(function(req, res, next) {
    var id = req.params.id || 0;
    var inusers = [], inids = [];
    // get users in action
    action.find({action: id})
        .populate('user')
        .exec(function(err, userin) {
            for(var ind in userin) {
                inids.push(userin[ind].user._id);
                inusers.push(userin[ind].user);
            }
            inusers.sort('nickname');
            user.find({_id: {$nin: inids}}).sort('nickname').exec(function(err, userout) {
                res.render('admin-action-users', {
                    usersin: inusers,
                    usersout: userout,
                    action: actions[id],
                    actionid: id
            });
        });
    });
})
.post(function(req, res, next) {
    var id = req.params.id,
        uid = req.body.id,
        dir = req.body.dir;
    if(dir === 'in') {
        // join in the action
        action.findOneAndUpdate({
            action: id,
            user: uid
        }, {
            action: id,
            user: uid
        }, {
            new: true,
            upsert: true
        }, function(err, result) {
            if(result) {
                $.result(res, {id: uid, msg: 'ok'});
            } else {
                $.result(res, {msg: err.message}, 400);
            }
        });
    } else {
        // quit from the action
        action.remove({action: id, user: uid}, function(err, result) {
            if(result) {
                $.result(res, {id: uid, msg: 'ok'});
            } else {
                $.result(res, {msg: err.message}, 400);
            }
        });
    }
});

router.route('/match/:id')
.get(function(req, res, next) {
    var id = req.params.id,
        dict = {}, froms = [], tos = [], acts = [],
        ind = 0, count;
    action
        .find({action: id})
        .populate('user')
        .exec(function(err, result) {
            var act;
            count = result.length;
            if(count === 0) {
                callback(true);
            } else {
                for(act in result) {
                    act = result[act];
                    tos.push(act._id.toString());
                    froms.push(act._id.toString());
                    dict[act._id.toString()] = act;
                }
                while(act = result.pop()) {
                    addUserPlusInfo(act);
                }
            }
        });
    function addUserPlusInfo(act) {
        var fromInd = Math.floor(Math.random() * froms.length),
            toInd = Math.floor(Math.random() * tos.length),
            fromId = froms[fromInd], toId = tos[toInd];
        if(fromId === act._id.toString() || toId === act._id.toString() || fromId === toId) {
            if(froms.length === 1) {
                callback(true);
            } else {
                addUserPlusInfo(act);
            }
        } else {
            fromId = froms.splice(fromInd, 1).pop();
            toId = tos.splice(toInd, 1).pop();
            act.plus = {
                from: dict[fromId].user._id,
                to: dict[toId].user._id
            }
            acts.push(act);
            if(++ind >= count) {
                callback();
            }
            action.findOneAndUpdate({
                _id: act._id
            }, {
                plus: act.plus
            }, function(){});
        }
    }
    function callback(fail) {
        if(fail) {
            $.result(res, {msg: '生成失败，请重试。'}, 999);
        } else {
            $.result(res, {msg: '匹配数据完成。'});
        }
    }

});

module.exports = router;
