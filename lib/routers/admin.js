var router = require('express').Router(),
    actions = require('../config/actions'),
    tempass = require('../models/tempass'),
    action = require('../models/action'),
    user = require('../models/user'),
    addressModel = require('../models/address'),
    multipart = require('connect-multiparty'),
    url = require('url'),
    parseXlsx = require('excel'),
    Q = require('q'),
    $ = require('../utils');

router.route('/')
    .get(function (req, res, next) {
        if (!req.session.fun) {
            user.find({
                isadmin: true
            }, function (err, result) {
                res.render('admin-login', {
                    users: result
                });
            });
        } else {
            res.redirect('/x/index');
        }
    })
    .post(function (req, res, next) {
        var openid = req.body.openid,
            code = req.body.code,
            now = +new Date();
        tempass.findOne({
            openid: openid
        }, function (err, result) {
            if (result) {
                if (result.code !== code) {
                    $.result(res, {
                        msg: '错误的登录码。'
                    }, 403);
                } else if (now - result.added > 3 * 60 * 1000) {
                    $.result(res, {
                        msg: '登录码已过期。'
                    }, 403);
                } else {
                    req.session.fun = openid;
                    $.result(res, {
                        msg: '登录成功。'
                    });
                }
            } else {
                $.result(res, {
                    msg: '登录失败！'
                }, 403);
            }
        });
    });

router.route(['/:cat', '/:cat/:id'])
    .get(function (req, res, next) {
        if (!req.session.fun) {
            res.redirect('/x');
        } else {
            next();
        }
    })
    .post(function (req, res, next) {
        if (!req.session.fun) {
            $.result(res, {
                msg: 'Please Login!'
            }, 403);
        } else {
            next();
        }
    });

router.route('/logout')
    .get(function (req, res, next) {
        req.session.destroy(function (err) {
            res.redirect('/x');
        });
    });

router.route('/index')
    .get(function (req, res, next) {
        res.redirect('/x/users');
    });

router.route('/users')
    .get(function (req, res, next) {
        user.find()
            .sort("nickname")
            .exec(function (err, result) {
                res.render('admin-users', {
                    users: result
                });
            });
    })
    .post(function (req, res, next) {
        var id = req.body.id,
            name = req.body.name.trim(),
            isguest = $.isTrue(req.body.isguest),
            isadmin = $.isTrue(req.body.isadmin);
        user.findOneAndUpdate({
            _id: id
        }, {
            name: name,
            isguest: isguest,
            isadmin: isadmin
        }, function (err, result) {
            if (result) {
                $.result(res, {
                    id: id,
                    msg: 'ok'
                });
            } else {
                $.result(res, {
                    id: id,
                    msg: err.message
                }, 404);
            }
        });
    });

router.route('/actions')
    .get(function (req, res, next) {
        // get actions list
        res.render('admin-actions', {
            actions: actions
        });
    });

router.route('/actions/:id')
    .get(function (req, res, next) {
        var id = req.params.id || 0;
        var inusers = [],
            inids = [];
        // get users in action
        action.find({
                action: id
            })
            .populate('user')
            .exec(function (err, userin) {
                for (var ind in userin) {
                    if (userin[ind].user) {
                        inids.push(userin[ind].user._id);
                        inusers.push(userin[ind].user);
                    }
                }
                user.find({
                        _id: {
                            $nin: inids
                        },
                        isguest: {
                            $ne: true
                        }
                    })
                    .exec(function (err, userout) {
                        res.render('admin-action-users', {
                            usersin: inusers,
                            usersout: userout,
                            action: actions[id],
                            actionid: id
                        });
                    });
            });
    })
    .post(function (req, res, next) {
        var id = req.params.id,
            uid = req.body.id,
            dir = req.body.dir;
        if (dir === 'in') {
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
            }, function (err, result) {
                if (result) {
                    $.result(res, {
                        id: uid,
                        msg: 'ok'
                    });
                } else {
                    $.result(res, {
                        msg: err.message
                    }, 400);
                }
            });
        } else {
            // quit from the action
            action.remove({
                action: id,
                user: uid
            }, function (err, result) {
                if (result) {
                    $.result(res, {
                        id: uid,
                        msg: 'ok'
                    });
                } else {
                    $.result(res, {
                        msg: err.message
                    }, 400);
                }
            });
        }
    });

router.route('/match/:id')
  .get(function (req, res, next) {
    let id = req.params.id;
    let output = [];

    action.find({
      action: id
    })
      .populate({
        path: 'user',
        select: 'nickname name'
      })
      .exec(async (err, result) => {
        for(let key in result) {
          let item = result[key];
          let name = item.user.name || item.user.nickname;
          let toid = item.plus.to;
          let to = await user.findOne({_id: toid});
          output.push(name + ' => ' + (to.name || to.nickname));
        }
        $.result(res, output)
      });

  })
    .post(function (req, res, next) {
        var id = req.params.id,
            dict = {}, all = [],
            men = [], women = [],
            ind = 0, count;
        action
            .find({
                action: id
            })
            .populate({
              path: 'user',
              select: 'sex'
            })
            .exec(function (err, result) {
                var act;
                count = result.length;
                if (count === 0) {
                  $.result(res, {
                    msg: '生成失败，请重试。'
                  }, 999);
                } else {
                    for (act in result) {
                        act = result[act];
                        if (act.user.sex === 2) {
                            women.push(act._id.toString());
                        } else {
                            men.push(act._id.toString());
                        }
                        dict[act._id.toString()] = act;
                    }
                    var ind1, ind2, user1, user2;
                    while(women.length > 0 || men.length > 0) {
                      // man index
                      ind1 = Math.floor(Math.random() * men.length);
                      // woman index
                      ind2 = Math.floor(Math.random() * women.length);
                      // man
                      user1 = men.splice(ind1, 1);
                      // woman
                      user2 = women.splice(ind2, 1);
                      // push a man to list
                      user1.length && all.push(user1[0]);
                      // push a woman to list
                      user2.length && all.push(user2[0]);
                    }
                    for (var i = 0; i < count; i++) {
                      action.findOneAndUpdate({
                        _id: all[i]
                      }, {
                        plus: {
                          to: i < count - 1 ? dict[all[i + 1]].user._id : dict[all[0]].user._id
                        }
                      }, function() {
                        if (++ind >= count) {
                          $.result(res, {
                            msg: '匹配数据完成。'
                          });
                        }
                      });
                    }
                }
            });
    });

router.route('/address')
    .get(function (req, res, next) {
        addressModel.find()
            .then(function (list) {
                res.render('admin-address', {
                    'list': list
                });
            })
            .then(undefined, function (err) {
                console.error(err);
                res.redirect('/x');
            });
    })
    .delete(function (req, res, next) {
        addressModel.remove({})
            .then(function (result) {
                res.end('success');
            })
            .then(undefined, function (err) {
                console.error(err);
                res.redirect('/x');
            });
    })
    .post(multipart(), function (req, res, next) {
        'use strict'
        var file = req.files.uploadFile;
        if (file) {
            parseXlsx(file.path, function (err, list) {
                if (err) throw err;
                // data is an array of arrays
                var p = [];
                for (let i = 3; i < list.length; i++) {
                    let data = list[i];
                    if (data[1]) {
                        let address = {
                            'geekid': data[0],
                            'name': data[1],
                            'position': data[2],
                            'department': data[3],
                            'phoneNumber': data[4],
                            'email': data[5],
                            'fesco': data[6]
                        };
                        p.push(addressModel.create(address));
                    }
                }
                Q.all(p)
                    .then(function (result) {
                        console.log('成功导入 ' + result.length +
                            ' 条通讯录');
                        res.redirect('/x/address');
                    })
                    .then(undefined, function (err) {
                        console.error(err);
                        res.end(err.toString());
                    });

            });
        }
    });

module.exports = router;
