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
                    var persons = [];
                    for (let i = 0; i < list.length; i++) {
                        let address = list[i];
                        var result = [];
                        result.push('姓名: ' + address.name);
                        result.push('电话: ' + address.phoneNumber);
                        result.push('邮箱: ' + address.email);
                        result.push('部门: ' + address.department);
                        persons.push(result.join('\n'));
                    }
                    echo(persons.join('\n-------\n'));
                } else {
                    echo('没有这个数据');
                }
            }
    });
};
