const { modelGoods } = require("@/model/goods")
const Validate = require("@/validate")
const fs = require("fs")
const { model } = require("mongoose")
const { apiKey} = require("@/config/default").aliyun
const OpenAI = require("openai")
const openai = new OpenAI(
    {
        apiKey,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
);

class GoodsController{
    //导入商品
    async addGoods(ctx) {
        const goodsList = fs.readFileSync("D:\\COMP DATA\\Desktop\\毕业设计\\毕业设计\\毕设代码初版\\AIGC-Node\\goods.json", "utf-8")
        const jsonGoods = JSON.parse(goodsList)
        await modelGoods.insertMany(jsonGoods)
    }

    //查询商品详情
    async queryGoodsDetails(ctx) {
        const { goodsId } = ctx.request.body
        await Validate.nullCheck(goodsId, "商品id不能为空", "goodsId")
        const res = await modelGoods.findById(goodsId)
        ctx.send([res]);
    }

    //通过大模型提取关键词搜索商品
    async searchGoods(ctx) {
        const { userMessages } = ctx.request.body
        await Validate.nullCheck(userMessages, "缺少用户对话", userMessages)
        const completion = await openai.chat.completions.create({
            
            model: "qwen-plus",  //模型列表
            messages: [
                {
                    role: "system", content: '你的主要职责就是根据提问提取关键词，我会给你发送一段用户的提问，你根据提问从中提取一个或两个景点关键词出来（不超过两个），你要特别注意，这里的关键词我需要涉及旅游，攻略城市地点相关的，当提取到关键词时你需要把关键词组合成一个json格式的数组字符串返回来，格式比如：["南京","徐州"],注意是包含引号的 JSON 字符串。如果没有提取到你就回复一个null即可，如果提问中包含车票查询、天气查询、打招呼或与旅游，景点介绍无关的提问，直接回复null'
                },
                {
                    role: "user", content: `用户提问：${userMessages}`
                }]
        });
        const keyWords = completion.choices[0].message.content
        console.log(keyWords)
        if (keyWords != "null") {
            //构建模糊查询商品
            const queryConditions = JSON.parse(keyWords).map(item => ({
                contentTitle:{$regex:new RegExp(item,"i")},
            }))
            const res = await modelGoods.find({ $or: queryConditions }).limit(10).select("coverImage contentTitle price"); 
            ctx.send(res)
        } else {
            ctx.send([])
        }
    }
}
module.exports=new GoodsController()