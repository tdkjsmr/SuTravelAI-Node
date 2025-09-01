//统一接口响应数据格式,koa中间件
const responseHandler = async (ctx, next) => {
    ctx.send = (data = null, code = 200, msg = "success", error = null, serviceCode = 200) => {
        ctx.body = {
            data,  //返回前端数据
            msg,   //提示信息
            error, //错误说明
            serviceCode //业务状态码
        }
        ctx.status = code
    }
    await next()
} 

module.exports = responseHandler;