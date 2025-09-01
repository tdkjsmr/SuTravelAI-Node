/*这是MongoDB的表配置*/ 
const { host } = require("@/config/default").datebase
const mongoose = require("mongoose")
mongoose.pluralize(null)  //使mongodb不在表名后加s
const { Schema, model } = mongoose

mongoose.connect(host)
    .then(res => {
    console.log("数据库连接成功")
    })
    .catch(err => {
        console.log(err)
        console.log("数据库连接失败")
    })

module.exports = {
    Schema, model,mongoose
    }