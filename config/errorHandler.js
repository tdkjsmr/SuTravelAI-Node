const logger = require("@/loggerMiddleware")
//捕获错误的中间件
const errorHandler = async (ctx, next) => {
    try {
        await next()
        logger.info(`输出日志：${ctx.method} ${ctx.url}`)
    } catch (errorData) {
        logger.error(errorData)
        
        if (errorData.validate === null) {
            const { code, msg, error } = errorData;
            const errorVal = error || null
            ctx.send(null, code, msg,errorVal);
        } else if (errorData.message === "Unexpected end of form") {
            ctx.send(null, 422, '请上传图片', null);
        } else if (errorData.error) {
            //智谱ai的错误
            const { message, code } = errorData.error;
            ctx.send(null, 200, "SUCCESS", message, code);
        }
        else {
            const error = errorData.message || '异常错误,请查看服务器端日志'
            const status = errorData.status || errorData.statusCode || 500;
            ctx.send(null, status, '服务器端异常!', error);
        }

        
    }
}
module.exports = errorHandler;
