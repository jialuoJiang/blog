/**
 * Created by MLS on 16/2/22.
 */

var setting=require('./setting');
var DB=require('mongodb').Db;
var Connection=require('mongodb').Connection;
var Server=require('mongodb').Server;

/*module.exports=new DB(setting.db,new Server(setting.host,{}));    // 输出了创建的数据库连接*/

module.exports=new DB(setting.db,new Server(setting.host,27017,{}));    // 输出了创建的数据库连接
