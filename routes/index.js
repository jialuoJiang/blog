var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var User = require("./User");
var Article = require("./article");
var fs = require("fs");
var formidable = require("formidable");
var avatarFolder = "public/images/avatar";
var nodemailer = require("nodemailer");
var pageSize = 15;// 一页15篇

/* GET home page. */

module.exports = function (app) {
    app.get("/", function (req, res) {
        var userName = req.session.user || "";
        var curPage = req.query.curPage || 1; // 默认是第一页
        if (userName && userName != "") {
            User.get(userName, function (err, user) {
                if (err) {
                    console.log(err);
                    res.render("error", {user: ""});
                    return;
                }
                var user = user;
                Article.getAll(function (err, articles) {
                    if (err) {
                        console.log(err);
                        res.render("error", {user: user});
                        return
                    }
                    var article = articles;
                    var pageNums = Math.ceil(article.length / pageSize) || 0;
                    article = getPageArticles(article, curPage, pageNums);
                    res.render("main", {user: user, articles: article, pageNums: pageNums, curPage: curPage});
                });
            });
        } else {
            Article.getAll(function (err, articles) {
                if (err) {
                    console.log(err);
                    res.render("error", {user: ""});
                    return;
                }
                var article = articles;
                var pageNums = Math.ceil(article.length / pageSize) || 0;
                article = getPageArticles(article, curPage, pageNums);
                res.render("main", {articles: article, user: "", pageNums: pageNums, curPage: curPage});
            });
        }
    });

    app.post("/uploadimg", function (req, res) {
        var userName = req.session.user || "";
        var userDirPath = avatarFolder;
        // 清空文件夹
        if (fs.existsSync(userDirPath)) {
            var files = [];
            files = fs.readdirSync(userDirPath);
            files.forEach(function (file, index) {
                var curPath = userDirPath + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    deleteFolderRecursice(curPath);
                } else {
                    fs.unlinkSync(curPath)
                }
            });
            fs.rmdirSync(userDirPath);
        }

        if (!fs.existsSync(userDirPath)) {
            fs.mkdirSync(userDirPath);
        }

        var form = new formidable.IncomingForm();// 创建上传表单
        form.encoding = "utf-8";// 设置编码
        form.uploadDir = userDirPath;// 设置上传目录
        form.keepExtensions = true;// 保留后缀
        form.maxFieldsSize = 2 * 1024 * 1024;// 文件大小
        form.type = true;
        form.parse(req, function (err, fileds, files) {
            if (err) {
                res.send({
                    code: "-2",
                    msg: "出错了"
                });
                return;
            }
            var extName = "";// 后缀名
            switch (files.uploadAvatar.type) {
                case "image/pjpeg":
                    extName = "jpg";
                    break;
                case "image/jpeg":
                    extName = "jpg";
                    break;
                case "image/png":
                    extName = "png";
                    break;
                case "image/x-png":
                    extName = "png";
                    break;
            }
            if (extName.length === 0) {
                res.send({
                    code: 202,
                    msg: "只支持png和jpg格式图片"
                });
                return;
            } else {
                var avatarName = "/" + "toux" + "." + extName;
                var newPath = form.uploadDir + avatarName;
                fs.renameSync(files.uploadAvatar.path, newPath); //重命名
                var imgPath = '../' + newPath.split('public/')[1];
                // 修改用户头像
                var data = {
                    theName: userName,
                    theImg: imgPath
                };
                User.changeAvatar(data, function (err, user) {
                    if (err) {
                        res.send({
                            code: "-2",
                            msg: "出错了"
                        });
                        return;
                    }
                    var user = user;
                    if (user && user == "success") {
                        res.send({
                            code: "0",
                            msg: "头像修改成功"
                        });
                    } else {
                        res.send({
                            code: "-1",
                            msg: "头像修改失败"
                        })
                    }
                });
            }
        })
    });

    app.post("/editPersonalInfo", function (req, res) {
        var user = req.session.user;
        var data = {};
        data = req.body;
        var keyWord = req.body.key || "";
        if (user && user != "") {
            // 修改个人信息
            User.edit(data, function (err, isOK) {
                if (err) {
                    console.log(err);
                    res.write(JSON.stringify(({code: "-2", msg: "出错了"})));
                    res.end();
                    return;
                }
                var isOK = isOK;
                if (isOK == "success") {
                    req.session.user = data.theName;
                    res.write(JSON.stringify(({code: "0", msg: "修改成功"})));
                    res.end();
                } else {
                    res.write(JSON.stringify(({code: "-1", msg: "修改失败"})));
                    res.end();
                }
            })
        } else {
            res.write(JSON.stringify(({code: "-2", msg: "出错了"})));
            res.end();
        }
    });

    app.get("/login", function (req, res) {
        res.render("login");
    });

    app.post("/login", function (req, res) {
        var md5 = crypto.createHash("md5");
        var newUser = new User({
            userName: req.body.userName || "",
            userPwd: req.body.userPwd || "",
            userEmail: req.body.userEmail || ""
        });
        // 登录
        if (newUser) {
            User.get(newUser.userName, function (err, user) {
                if (err) {
                    console.log(err);
                    res.render("error", {user: ""});
                    return;
                }
                var user = user;
                if (user == "") {
                    res.send({code: "-1", msg: "用户不存在"});
                } else if (user && user != "" && user.userPwd != newUser.userPwd) {
                    res.send({code: "-2", msg: "密码错误"});
                } else {
                    req.session.user = user.userName;
                    res.send({code: "0", msg: "登录成功"});
                }
            })
        } else {
            res.render("error", {user: ""});
        }
    });
    app.post("/register", function (req, res) {
        var md5 = crypto.createHash("md5");
        var newUser = new User({
            userName: req.body.userName || "",
            userPwd: req.body.userPwd || "",
            userEmail: req.body.userEmail || ""
        });
        // 注册
        if (newUser) {
            User.get(newUser.userName, function (err, user) {
                if (err) {
                    console.log(err);
                    res.render("error", {user: ""});
                    return;
                }
                if (user) {
                    res.write(JSON.stringify({code: "-1", msg: "用户名已存在"}));
                    res.end();
                    return;
                }
                // 如果不存在则新增
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    req.session.user = newUser.userName;
                    res.write(JSON.stringify({code: "0", msg: "注册成功"}));
                    res.end();
                })
            })
        } else {
            res.render("error", {user: ""});
        }
    });

    app.get("/add", function (req, res) {
        var userName = req.session.user.userName || req.session.user; // 实际上是userName
        if (userName && userName != "") {
            User.get(userName, function (err, user) {
                if (err) {
                    console.log(err);
                    res.render("error", {user: ""});
                    return;
                }
                var user = user;
                res.render("add", {user: user})
            });
        } else {
            res.render("error", {user: ""});
        }
    });

    //  post /add 时必然是已经登录的状态,否则跳转到登录页面
    app.post("/add", function (req, res) {
        var user = req.session.user.userName || req.session.user;
        if (user && user == "") {
            res.render("login");
            return;
        }
        var newArticle = new Article({
            articleTitle: req.body.articleTitle || "",
            articleContent: req.body.articleContent || "",
            articlePubTime: req.body.articlePubTime || "",
            articleAuthor: req.body.articleAuthor || "姜小白"
        });
        newArticle.save(function (err) {
            if (err) {
                console.log(err);
                var data = {
                    code: "-1",
                    msg: "新增文章出错，你可以联系姜小白！"
                }
                res.send(data);
                res.end();
                return;
            }
            var data = {
                code: "0",
                msg: "新增文章成功"
            }
            res.send(data);
        })
    });

    app.get("/full", function (req, res) {
        var userName = req.session.user || "";
        var id = req.query.articleId || req.body.articleId || "";
        if (id && id != "") {
            if (userName && userName != "") {
                User.get(userName, function (err, user) {
                    if (err) {
                        console.log(err);
                        res.render("error", {user: ""});
                        return;
                    }
                    var user = user;
                    Article.getById(id, function (err, articles) {
                        if (err) {
                            console.log(err);
                            res.render("error", {user: user});
                            return;
                        }
                        var article = articles;
                        res.render("full", {user: user, article: article});
                    })
                })
            } else {
                Article.getById(id, function (err, articles) {
                    if (err) {
                        console.log(err);
                        res.render("error", {user: ""});
                        return;
                    }
                    var article = articles;
                    res.render("full", {user: "", article: article});
                })
            }
        } else {
            res.render("found")
        }
    });

    app.post("/delete", function (req, res) {
        var id = req.body.theid || req.query.theid;
        if (id) {
            Article.deleteById(id, function (err) {
                if (err) {
                    console.log(err);
                    res.send({
                        code: "-2",
                        msg: "出错啦"
                    });
                    return;
                }
                res.send({
                    code: "0",
                    msg: "成功删除文章"
                })

            })
        } else {
            res.render("error", {user: ""})
        }
    });

    app.get("/edit", function (req, res) {
        var userName = req.session.user;
        var id = req.body.articleId || req.query.articleId;
        if (userName && userName != "") {
            User.get(userName, function (err, user) {
                if (err) {
                    console.log(err);
                    res.render("error", {user: ""});
                    return;
                }
                var user = user;
                if (id) {
                    Article.getById(id, function (err, articles) {
                        if (err) {
                            console.log(err);
                            res.render("error", {user: user});
                            return;
                        }
                        var article = articles;
                        res.render("edit", {user: user, article: article});
                    })
                } else {
                    res.render("found");
                }
            })
        } else {
            res.render("found");
        }
    });

    app.post("/edit", function (req, res) {
        var user = req.session.user.userName || req.session.user;
        var data = {
            time: req.body.time || "",
            title: req.body.title || "",
            content: req.body.content || "",
            id: req.body.id || ""
        };

        if (user) {
            Article.update(data, function (err, isOK) {
                if (err) {
                    console.log(err);
                    res.send({
                        code: "-2",
                        msg: "出错啦"
                    });
                    return;
                }
                var isOk = isOK;
                if (isOK == "success") {
                    data = {
                        code: "0",
                        msg: "更新成功"
                    };
                    res.send(data);
                } else {
                    data = {
                        code: "-1",
                        msg: "更新失败"
                    };
                    res.send(data);
                }
            })
        } else {
            var data = {
                code: "-2",
                msg: "出错了"
            };
            res.send(data);
        }
    });

    app.get("/notfound", function (req, res) {
        res.render("notfound")
    });
    app.get("/error", function (req, res) {
        var user = req.session.user;
        if (user && user != "") {
            res.render("error", {user: user});
        } else {
            res.render("error", {user: ""});
        }
    });
    app.get("/query", function (req, res) {
        var userName = req.session.user;// 此时的session 实际存储的是userName
        var keyWord = req.query.key || "";
        var type = req.query.type || "";
        var curPage = req.query.curPage || 1; // 默认是第一页
        if (keyWord && keyWord != "") {
            if (userName && userName != "") {
                User.get(userName, function (err, user) {
                    if (err) {
                        console.log(err);
                        res.render("error", {user: ""});
                        return;
                    }
                    var user = user;
                    queryByTypeWithUser(res, type, keyWord, user, curPage);
                })
            } else {
                var user = "";
                queryByTypeWithUser(res, type, keyWord, user, curPage);
            }
        } else {
            res.render("found");
        }
    });

    app.get("/confirm_win", function (req, res) {
        res.render("confirm_win")
    });

    app.get("/retrieve", function (req, res) {
        res.render("retrieve")
    });

    app.post("/retrievePwd", function (req, res) {
        var email = req.body.email || "";
        if (email && email != "") {
            var newdata = resetUserPwd(email);
            var transporter = nodemailer.createTransport({
                //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
                service: 'qq',
                port: 465, // SMTP 端口
                secureConnection: true, // 使用 SSL
                auth: {
                    user: '2445150285@qq.com',
                    pass: 'axyydajrblaheahd' //这里密码不是qq密码，是你设置的smtp密码
                }
            });

            // NB! No need to recreate the transporter object. You can use
            // the same transporter object for all e-mails

            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: '2445150285@qq.com', // 发件地址
                to: newdata.email, // 收件列表
                subject: 'Hello sir ,找回密码', // 标题
                //text和html两者只支持一种
                text: 'Hello sir ,找回密码', // 标题
                html: '<b>Hello sir</b><p>这是您的新密码' + newdata.newPwd + '，请用它重新登录，登录成功后建议您修改密码</p>' // html 内容
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });
        } else {
            res.render("error", {user: ""});
        }
    });


    app.get("/modify", function (req, res) {
        var userName = req.session.user || "";
        if (userName && userName != "") {
            User.get(userName, function (err, user) {
                if (err) {
                    console.log(err);
                    res.render("error", {user: ""});
                }
                var userInfo = user;
                res.render("modify", {user: userInfo})
            })
        } else {
            res.render("login")
        }
    });

    app.post("/modify", function (req, res) {
        var originName = req.session.user || "";
        if (originName && originName != "") {
            var modifyData = {
                username: req.body.modifyNickName,
                pwd: req.body.modifyPwd,
                email: req.body.modifyEmail,
                brief: req.body.modifyBrief
            };
            User.edit(originName, modifyData, function (err, infos) {
                if (err) {
                    console.log(err);
                    res.send({
                        msg: "出错了,打开数据库失败",
                        code: "-1"
                    });
                }
                if (infos == "fail") {
                    res.send({
                        msg: "出错了,修改用户信息时出错",
                        code: '-2'
                    });
                }
                else {
                    req.session.user = modifyData.username;
                    res.send({
                        code: '0',
                        msg: "修改成功"
                    })
                }
            })
        } else {
            res.send({
                code: '-3',
                msg: "获取用户登录状态失败，正常情况下用户应该处于登录状态，能获取到session中的user"
            })
        }
    });

    function resetUserPwd(email) {
        // 把用户 userName的密码改成任意的6位数
        var md5 = crypto.createHash("md5");
        var charArray = '1234567890qwertyuioplkjhgfdsazxcvbnm';
        var newPwd = '';
        for (var i = 0; i < 6; i++) {
            newPwd += charArray.charAt(Math.random() * 36);
        }
        var data = {
            newPwd: newPwd /*md5.update(newPwd).digest("base64")*/ || newPwd,
            email: email
        };
        User.resetUserPwd(data, function (err, infos) {
            if (err) {
                return console.log(err);
            }
        });
        return data
    }

    // 得到当前页面对应的文章， 比如当前为第4页，每页10篇文章， 则获取第 30-40篇 或者直接使用skip() 和limit()配合实现
    function getPageArticles(article, curPage, pageNums) {
        var begins = (curPage - 1) * pageSize;
        if (curPage == pageNums) {
            var ends = article.length;
            var theArticle = article.slice(begins, ends);
            return theArticle
        } else {
            var ends = curPage * pageSize;
            var theArticle = article.slice(begins, ends);
            return theArticle;
        }
    }

    // 把具体的查询过程提出来
    function queryByTypeWithUser(res, type, keyWord, user, curPage) {
        if (type == "fulltext") {
            queryByContent(keyWord, res, curPage, user);
        }
        if (type == "title") {
            queryByTitle(keyWord, res, curPage, user);
        }

        // 文章内容查询
        function queryByContent(keyWord, res, curPage, user) {
            Article.getByCont(keyWord, function (err, articles) {
                if (err) {
                    res.render("error", {user: ""});
                    return;
                }
                var article = articles;
                var pageNums = Math.ceil(article.length / pageSize) || 0;
                article = getPageArticles(article, curPage, pageNums);
                res.render("query", {user: user, articles: article, curPage: curPage, pageNums: pageNums})
            })
        }

        // 文章标题查询
        function queryByTitle(keyWord, res, curPage, user) {
            Article.getByTitle(keyWord, function (err, articles) {
                if (err) {
                    res.render("error", {user: ""});
                    return;
                }
                var article = articles;
                var pageNums = Math.ceil(article.length / pageSize) || 0;
                article = getPageArticles(article, curPage, pageNums);
                res.render("query", {user: user, articles: article, curPage: curPage, pageNums: pageNums})
            })
        }
    }
};