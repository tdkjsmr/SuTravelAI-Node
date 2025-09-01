const Router = require("@koa/router")
const router = new Router()

//登录
const user = require("@/controller/user")
//大模型对话
const chat = require("@/controller/chat")

//工具查询
const calltool = require("@/controller/callTool")

//操作商品
const goods = require("@/controller/goods")

//投诉页面
const complaint = require("@/controller/complaint")

//deepseek对话接口
const deepseek = require("@/controller/deepseek")

//zhipuAI
const zhipu = require("@/controller/zhipuai");

//权限处理
const authority = require("@/config/auth")
//聊天记录对话存储
const chatHistory = require("@/controller/chatHistory")

//对话输出接口
router.post('/chatMessage',authority, chat.chatMessageToAI);   //通义千问
router.post('/deepseeekMessage',authority, deepseek.chatMessageToAI);    //deepseek
 //登录
router.post('/login',user.login) 
//查询火车票
router.post("/queryTrainTickets", calltool.queryTrainTickets)
//查询天气
router.get('/queryWeather',calltool.queryWeather)


//导入商品
router.get('/addGoods',goods.addGoods)
//查询商品
router.post('/queryGoodsDetails', goods.queryGoodsDetails)
//搜索商品
router.post('/searchGoods', goods.searchGoods)
//提交投诉
router.post("/addComplaint", authority, complaint.addComplaint)
//ai绘图
router.post("/create-images",authority, zhipu.createImages);


//存储聊天记录
router.post("/save-chat-history",authority, chatHistory.saveChatHistory);
//获取用户全部聊天记录
router.get("/fetch-chat-history", authority,chatHistory.fetchChatHistory);
//点击聊天记录获取对应聊天记录
router.get("/online-chat-history", authority,chatHistory.onliChatHistory);

module.exports = router