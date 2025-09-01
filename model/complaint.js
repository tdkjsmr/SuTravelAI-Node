const { Schema, model } = require("@/config/dataBase")
var dayjs = require('dayjs')
//定义商品字段
const complaintSchema = new Schema({
      // 投诉对象
      complaintTarget: {
        type: String,
        required: true,
      },
      // 投诉原因
      complaintReason: {
        type: String,
        required: true,
      },
      // 投诉地区
      location: {
        type: String,
        required: true,
      },
      // 诉求
      appeal: {
        type: String,
        required: true,
      },
      // 姓名
      userName: {
        type: String,
        required: true,
      },
      // 联系方式
      phoneNumber: {
        type: String,
        required: true,
      },
      // 旅行方式
      travelMethod: {
        type: String,
        required: true,
      },
    //创建时间
    createTime: {
        type: String, 
        default: () => dayjs().format("YYYY-MM-DD HH:mm:ss")
    },
},{versionKey:false})  //使mongodb不添加字段_v

module.exports = {
    modelComplaint:model("complaint",complaintSchema)
}