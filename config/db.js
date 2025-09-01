/*这是Mysql的表配置*/ 
const { Sequelize } = require('sequelize');
const {datebase,userName,password,host} = require('./default').db
const db = new Sequelize(datebase,userName , password, {
    host,
    dialect: 'mysql',
    logging: false,
    define:{
        freezeTableName: true,   //数据库禁止自动给表名加复数
        timestamps:false
         
    },
    sync: {  //不会强制删除现有表并重新创建
        force:false
    }
});
  
db.sync();//如果表不存在就创建
module.exports = db;