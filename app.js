const Koa = require("koa")
const app = new Koa()
const { addAliases } = require("module-alias")
addAliases({
    "@":__dirname
})
const json = require("koa-json") //将http响应数据转换为json模块
const bodyParser = require("koa-bodyparser")  //解析http请求消息体
const cors = require("@koa/cors")
const koaredis = require("ioredis") 
const responseHandler = require('@/config/result')
const errorHandler = require('@/config/errorHandler')
const static = require("koa-static") //提供静态文件中间件
const path = require("path")



app.use(json());
app.use(bodyParser());
app.use(cors());
app.use(responseHandler)
app.use(errorHandler)
app.use(static(path.join(__dirname)))
const redisClient = new koaredis({
    port: 6379,
    host: "127.0.0.1"    
})
app.use(async (ctx, next)=>{
    ctx.redis = redisClient
    await next()
})
app.listen(7000, () => {
    console.log('Server running on port 7000');
});
const router = require("@/router")
app.use(router.routes()).use(router.allowedMethods());
console.log("端口已启动!")