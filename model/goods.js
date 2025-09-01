const { Schema, model, mongoose } = require("@/config/dataBase")
var dayjs = require('dayjs')
const { version } = require("mongoose")
//定义商品字段
const goodsSchema = new Schema({
    //封面图
    coverImage: {
        type: String,
        required: true
    },
    //商品标题
    contentTitle: {
        type: String,
        required: true
    },
    //价格
    price: {
        type: Number,
        required: true
    },
    //详情图
    productImages: {
        type: [String],
        required: true
    },
    //创建时间
    createTime: {
        type: String, 
        default: () => dayjs().format("YYYY-MM-DD HH:mm:ss")
    },
},{versionKey:false})  //使mongodb不添加字段_v

module.exports = {
    modelGoods:model("goods",goodsSchema)
}