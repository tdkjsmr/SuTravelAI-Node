
const { appCode,appCode2, queryTrainTicketsUrl ,queryWeatherUrl} = require("@/config/default").aliyun
const Validate = require("@/validate/index")
const axios = require("axios").default
class CallToolController{

    //查询火车票
    //https://market.aliyun.com/apimarket/detail/cmapi011240?spm=5176.730005.result.2.7fa3414aNjSrXa&innerSource=search_%E7%81%AB%E8%BD%A6%E7%A5%A8%E6%9F%A5%E8%AF%A2#sku=yuncode524000008
    async queryTrainTickets(ctx){
        const { departure, destination, date } = ctx.request.body
        await Validate.nullCheck(departure, "请传入出发地", "departure")
        await Validate.nullCheck(destination, "请传入目的地", "destination")
        await Validate.nullCheck(date, "请传入出发时间", "date")
        try {
            const res=  await axios.get(queryTrainTicketsUrl, {
                params: { start: departure, end: destination, date },
                headers:{Authorization:`APPCODE ${appCode2}`}
            })   //拼接
            ctx.send(res.data.result.list)
        } catch(error) {
            const status = ['201', '203']     //云市场某三流程序员写接口时把状态码设置成string
            console.log(error.response)
            if (status.includes(error.response.data.status)) {
                ctx.send([],200,"非常抱歉，没有查询到对应的车票信息。有可能是当日内车票已全部售罄，请您更换车站信息后再次查询。",null,201)
            } else {
                throw{msg:"查询出现异常错误",code:400 ,validate :null} 
            }
        }
    }

    //查询天气
    //https://market.aliyun.com/apimarket/detail/cmapi010812?spm=5176.730005.result.2.367c414aXccUfw&innerSource=search_%E5%A4%A9%E6%B0%94#sku=yuncode4812000017
    async queryWeather(ctx) {
        const { city } = ctx.query;
        await Validate.nullCheck(city, '请传入城市地区', "city")
        try {
            const res = await axios.get(queryWeatherUrl, {
                params: { area: city },
                headers:{Authorization:`APPCODE ${appCode}`}
            })
            ctx.send(res.data.showapi_res_body.dayList)
        } catch (error) {
            console.log("出错")
            if (error.response.status === 450 && error.response.data) {
                ctx.send([],200,"没有查询到该地区天气，请您重新尝试或者更换地区查询",null,201)
            } else {
                throw{msg:"查询出现异常错误",code:400 ,validate :null} 
            }
        }
    }
}
module.exports = new CallToolController()