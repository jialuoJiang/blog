/**
 *  文章 增删改查
 */

var mongodb = require('./db');
var ObjectId = require('mongodb').ObjectId;

function Article(article) {
    this.articleContent = article.articleContent,
        this.articleAuthor = article.articleAuthor,
        this.articlePubTime = article.articlePubTime,
        this.articleTitle = article.articleTitle,
        this.articleReadNums=0,
        this.articleLikes=0;
}
module.exports = Article;
// 新增文章
Article.prototype.save = function save(callback) {
    var article = {
        articleContent: this.articleContent,
        articleAuthor: this.articleAuthor,
        articlePubTime: this.articlePubTime,
        articleTitle: this.articleTitle,
        articleReadNums:this.articleReadNums,
        articleLikes:this.articleLikes
    };
    mongodb.open(function (err, db) {
        if (err) {
            console.log('--打开数据库出错');
            return callback(err);
        }
        db.collection('article', function (err, collection) {
            if (err) {
                mongodb.close();
                console.log('--读取article collection出错');
                return callback(err);
            }
            // 为发布时间添加索引
            collection.ensureIndex({'articlePubTime': 1}, {unique: true});
            collection.insert(article, {safe: true}, function (err, article) {
                mongodb.close();
                if (err) {
                    console.log('--在article collection中insert出错');
                    return callback(err);
                }
                callback(err, article);
            })
        })
    })
};

// 查找全部文档
Article.getAll = function getAll(callback) {
    mongodb.open(function (err, db) {
        if (err) {
            console.log('--打开数据库出错');
            return callback(err)
        }
        db.collection('article', function (err, collection) {
            if (err) {
                mongodb.close();
                console.log('--连接 article collection出错');
                return callback(err);
            }
            var query = {};
            collection.find(query).sort({articlePubTime: -1}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    console.log('--在article collection getAll 出错');
                    return callback(err, null);
                }
                // 封装article为article对象
                var articles = [];
                docs.forEach(function (docs) {
                    articles.push(docs);
                });
                callback(null, articles);
            })
        })
    })
};

// 查找文章内容是否包含partCont
Article.getByCont = function getByCont(partCont, callback) {
    var partCont = partCont;
    mongodb.open(function (err, db) {
        if (err) {
            console.log('--打开 数据库出错');
            return callback(err);
        }
        // 读取articles集合
        db.collection('article', function (err, collection) {
            if (err) {
                mongodb.close();
                console.log('-- 读取 article collection 出错');
                return callback(err);
            }
            if (partCont) {
                collection.find({articleContent: {$regex: partCont}}).sort({articlePubTime: -1}).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        console.log('-- 在article 中查找 partCont出错');
                        return callback(err, null);
                    }
                    var articles = [];
                    docs.forEach(function (item) {
                        articles.push(item);
                    });
                    callback(null, articles);
                })
            }
        })
    })
};

Article.getByTitle = function getByTitle(partTitle, callback) {
    var partTitle = partTitle;
    mongodb.open(function (err, db) {
        if (err) {
            console.log('--打开数据库出错');
            return callback(err);
        }
        // 读取articles集合
        db.collection('article', function (err, collection) {
            if (err) {
                mongodb.close();
                console.log('--读取article collection出错');
                return callback(err);
            }
            if (partTitle) {
                collection.find({articleTitle: {$regex: partTitle}}).sort({articlePubTime: -1}).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        console.log('--在 article collection中 查找 partTitle失败')
                        return callback(err, null);
                    }
                    var articles = [];
                    docs.forEach(function (item) {
                        articles.push(item);
                    });
                    callback(null, articles);
                })
            }
        })
    })
}

// 根据_id 查找
Article.getById = function getByTime(id, callback) {
    var theid = id;
    mongodb.open(function (err, db) {
        if (err) {
            console.log('--打开数据库出错');
            return callback(err);
        }
        // 读取articles集合
        db.collection('article', function (err, collection) {
            if (err) {
                mongodb.close();
                console.log('--读取article collection出错');
                return callback(err);
            }

            var pre = null, next = null, articles = {};
            collection.find({}).sort({'articlePubTime': 1}).toArray(function (err, doc) {
                mongodb.close();
                if (err) {
                    console.log('在 collection  article 中find({}) 出错');
                    return callback(err, null)
                }
                var docLength = doc.length;
                if (doc && docLength > 0) {
                    if (docLength == 1) {
                        pre = null;
                        next = null;
                        articles = doc;
                    } else {
                        for (var i = 0; i < docLength; i++) {
                            if (doc[i]._id == theid) {
                                articles = doc[i];
                                if (i == 0) {
                                    pre = null;
                                    next = doc[i + 1]._id;
                                }
                                else if (i == docLength - 1) {
                                    pre = doc[i - 1]._id;
                                    next = null;
                                } else {
                                    pre = doc[i-1]._id;
                                    next = doc[i + 1]._id
                                }
                            }
                        }
                    }
                }
                articles.pre = pre;
                articles.next = next;
                callback(null, articles);
            });
        })
    })
};

Article.deleteById = function deleteByTime(id, callback) {
    var theid = id;
    mongodb.open(function (err, db) {
        if (err) {
            console.log('--打开数据库出错');
            return callback(err);
        }
        // 读取articles集合
        db.collection('article', function (err, collection) {
            if (err) {
                console.log('--读取 article collection出错');
                mongodb.close();
                return callback(err);
            }
            if (theid) {
                collection.remove({_id: ObjectId(theid)});
                callback();
            }
        })
    })
};

Article.update = function update(data, callback) {
    var data = data;
    mongodb.open(function (err, db) {
        if (err) {
            console.log('--打开数据库出错');
            return callback(err);
        }
        // 读取articles集合
        db.collection('article', function (err, collection) {
            if (err) {
                mongodb.close();
                console.log('--读取 article collection 出错');
                return callback(err);
            }
            if (data) {
                collection.update({_id: ObjectId(data.id)}, {
                    $set: {
                        articleTitle: data.title,
                        articleContent: data.content,
                        articlePubTime: data.time
                    }
                });
                mongodb.close();
                if (err) {
                    console.log('-- 在collection article中update 出错 ');
                    return callback(err, 'fail');
                }
                callback(null, 'success');
            }
        })
    })
};
