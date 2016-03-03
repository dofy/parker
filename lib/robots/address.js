var a = require('../models/address');


module.exports = function (user, content, echo) {

    a.findAddress(content, function (err, list) {
        "use strict"
        if (err) {
            console.error(err);
            echo('出错了！！！');
        } else {
            if (list) {
                console.log(list);
                var result = [];
                for (let i = 0; i < list.length; i++) {
                    let address = list[i];
                    result.push('姓名:' + address.name + ', 电话号码:' +
                        address.phoneNumber + ', email:' +
                        address.email + ', 部门:' + address.department
                    );
                }
                echo(result.join('/n'));
            } else {
                echo('没有这个数据');
            }
        }
    });
};
