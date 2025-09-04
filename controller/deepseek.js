const OpenAI = require("openai")
const { apiKey } = require("@/config/default").aliyun
const {systemContent} = require("@/config/default").deepseek
const Validate = require("@/validate/index")
const openai = new OpenAI(
    {
        apiKey,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
);
class DeepseekController{
    //对话，流式输出
    async chatMessageToAI(ctx) {
        const { chatMessage } = ctx.request.body;
            //校验
        await Validate.isarrayCheck(chatMessage, 'chatMessage字段不能为空', 'chatMessage');
        //删除数组最后一项
        chatMessage.pop();
        let messages = [
            { role: "system", content: systemContent }, ...chatMessage
        ]
        const completion = await openai.chat.completions.create({
            
            model: "deepseek-r1",  //模型列表
            messages,
            stream: true
        });
        ctx.status = 200
        //迭代
        for await (const chunk of completion) { 
            const delta = chunk.choices[0].delta;
             // 处理思考过程
            if (delta.reasoning_content) {
                const resObj = JSON.stringify({ type: "content", functionName:"", data: delta.reasoning_content ,modelType:"deepseek-R1",replyType:"reasoning"})
                const buffer = Buffer.from(resObj) //流式输出
                ctx.res.write(buffer)
            }
            // 处理回复内容 
            else if (delta.content) {
                const resObj = JSON.stringify({ type: "content", functionName:"", data: delta.content ,modelType:"deepseek-R1",replyType:"content"})
                const buffer = Buffer.from(resObj) //流式输出
                ctx.res.write(buffer)
            }
        }
    } 
}

module.exports = new DeepseekController()
