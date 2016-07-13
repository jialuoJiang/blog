var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs=require("fs");
var accessLogfile=fs.createWriteStream('access.log',{flags:'a'});
var errorLogfile=fs.createWriteStream('error.log',{flags:'a'});

var routes = require('./routes/index');
var users = require('./routes/users');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var setting = require('./routes/setting');
//var flash=require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
app.use(logger({stream:accessLogfile}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true,limit:"3mb"}));
app.use(bodyParser.json({limit:"3mb"}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: setting.cookieSecret,
    store: new MongoStore({
        url: 'mongodb://localhost/' + setting.db
    })
}));



//app.use(flash());

/*app.use(session({
 secret:setting.cookieSecret,
 store:new MongoStore({
 db:setting.db,
 })
 }))*/

/*app.use('/', routes);
 app.use('/users', users);
 app.use('/logreg',routes);*/
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err, '----------111111')
        if(err){
            var meta='['+new Date()+']'+req.url+'\n';
            errorLogfile.write(meta+err.stack+'\n');
        }
        if(err.status==413){
            console.log('请求实体过大')
        }
        if(err && err.status==404){
            res.render("found");
            return;
        }
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            user:""
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    if(err){
        var meta='['+new Date()+']'+eq.url+'\n';
        errorLogfile.write(meta+err.stack+'\n');
    }
    res.status(err.status || 500);
    console.log(err, '-------22222');
    res.render('error', {
        message: err.message,
        error: {},
        user:""
    });
});

module.exports = app;
