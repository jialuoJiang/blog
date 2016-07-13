/**
 * User 是一个描述数据的对象，即MVC架构中的模型 ,模型是真正和数据打交道的工具
 */

var mongodb = require('./db');

function User(user) {
    this.userName = user.userName,
    this.userPwd = user.userPwd,
    this.userEmail = user.userEmail,
    this.userBrief = user.userBrief || "",
    this.userImage = user.userImage || ""
}

module.exports = User;

User.prototype.save = function save(callback) {
    // 存入MongoDB文档
    var user = {
        userName: this.userName,
        userPwd: this.userPwd,
        userEmail: this.userEmail,
        userBrief: this.userBrief || "",
        userImage: this.userImage || ""
    };
    mongodb.open(function (err, db) {
        if (err) {
            console.log('----打开数据库出错');
            return callback(err)
        }
        // 读取users集合
        db.collection('user', function (err, collection) {
            if (err) {
                mongodb.close();
                console.log('--读取users collection集合出错');
                return callback(err);
            }
            // 为userName属性添加索引
            collection.ensureIndex('userName', {unique: true});
            // 写入user文档
            collection.insert(user, {safe: true}, function (err, user) {
                mongodb.close();
                if (err) {
                    console.log('--写入数据到user文档出错');
                    return callback(err);
                }
                callback(null, user)
            });
        });
    });
};
// 根据userName查询
User.get = function get(userName, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            console.log('--打开数据库出错');
            return callback(err);
        }
        // 读取user集合
        db.collection('user', function (err, collection) {
            if (err) {
                mongodb.close();
                console.log('--读取user collection出错');
                return callback(err);
            }
            // 查找userName 属性为userName 的文档
            collection.findOne({userName: userName}, function (err, doc) {
                mongodb.close();
                if (err) {
                    console.log('--在user collection中查找出错');
                    return callback(err);
                }
                if (doc) {
                    // 封装为User对象
                    var user = new User(doc);
                    callback(null, user);
                } else {
                    callback(null, "");
                }
            });
        });
    });
};
// 编辑个人信息
User.edit = function edit(oriName, modifyData, callback) {
    var oriname = oriName;
    var modifydata = modifyData;
    mongodb.open(function (err, db) {
        if (err) {
            console.log('--打开数据库出错');
            return callback(err);
        }
        db.collection('user', function (err, collection) {
            if (err) {
                mongodb.close();
                console.log('--读取user collection出错');
                return callback(err);
            }
            collection.update({userName: oriname}, {
                $set: {
                    userName: modifydata.username,
                    userPwd: modifydata.pwd,
                    userEmail: modifydata.email,
                    userBrief: modifydata.brief
                }
            });
            mongodb.close();
            if (err) {
                console.log('---在user collection中update出错');
                return callback(err, 'fail');
            }
            callback(null, 'success');
        })
    })
};

User.changeAvatar=function changeAvatar(data,callback){
    console.log(data,'----------data')
    var data=data;
    mongodb.open(function(err,db){
        if(err){
            console.log('--打开数据库出错');
            return callback(err);
        }
        db.collection('user',function(err,collection){
            if(err){
                console.log('--读取 user collection出错');
                return callback(err);
            }
            collection.find({'userName':data.theName},function(err,doc){
                if(err){
                    console.log('--在user 集合中根据userName查找出错');
                    return callback(err);
                }
                if(doc){
                    collection.update({'userName':data.theName},{
                        $set:{
                            userImage:data.theImg
                        }
                    },function(err){
                        mongodb.close();
                        if(err){
                            console.log('--在collection user中修改userImage出错');
                            return callback(err);
                        }
                        callback(null,'success')
                    })
                }else{
                    mongodb.close();
                    console.log('---在user 集合中根据userName 查找 无查询结果');
                   return callback('---在user 集合中根据userName 查找 无查询结果')
                }
            })
        })
    })
};


// 修改密码，应用于于在用邮件找回密码时
User.resetUserPwd = function resetUserPwd(data, callback) {
    var newPwd = data.newPwd;
    var email = data.email;
    mongodb.open(function (err, db) {
        if (err) {
            console.log('--打开数据库出错');
            return callback(err);
        }
        db.collection('user', function (err, collection) {
            if (err) {
                console.log('---读取user collection出错');
                return callback(err);
            }
            collection.findOne({userEmail: email}, function (err, doc) {
                if (err) {
                    console.log('在 user collection中查找出错 ');
                    return callback(err);
                }
                if (doc) {
                    // 重置密码
                    collection.update({userName: doc.userName}, {
                        $set: {
                            userPwd: newPwd
                        }
                    },function(err,info){
                        mongodb.close();
                        if(err){
                           console.log('--在user collection 中重置userPwd出错');
                            return callback(err);
                        }
                        return callback("", "success");
                    });
                } else {
                    mongodb.close();
                    console.log('---在user 集合中根据userEmail 查找 无查询结果');
                    return callback('---在user 集合中根据userEmail 查找 无查询结果')
                }
            })
        })
    })
};