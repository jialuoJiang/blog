var express = require('express');
var router = express.Router();

/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

module.exports =function(app){
    app.get('/',function(req,res){
        res.send('respond with a resource')
    })
};
