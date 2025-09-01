const OpenAI = require("openai")
const { apiKey ,systemContent} = require("@/config/default").aliyun

const Validate = require("@/validate/index")
const tools = require('@/config/tool')
const openai = new OpenAI(
    {
        apiKey,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
);

class ChatController{
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
            model: "qwen-plus",  //模型列表
            messages,
            stream: true,
            tools,
            enable_search: true
        });

        ctx.status = 200

        let functionName = "";   //函数名称
        let requirePar = "";    //函数参数
        //迭代
        for await (const chunk of completion) {
            //console.log(JSON.stringify(chunk));
            const str = JSON.stringify(chunk)
            const obj = JSON.parse(str)
            
            const choices = obj.choices[0].delta;
            console.log(choices.tool_calls)
            //判断是否可以调用函数工具
            if (choices.content === null && choices.tool_calls !== null) {
                
                //有工具调用
                if (messages[messages.length - 1].role !== "assistant") {
                    
                    messages.push({
                        role:"assistant",content:"",tool_calls:[]
                    })
                    var lastMessage = messages[messages.length - 1];
                }
                
                //取出模型要调用的工具
                const toolCalls = choices.tool_calls
                
                if (toolCalls.length > 0) {
                    if (lastMessage.tool_calls.length <= 0) {
                        functionName = toolCalls[0].function.name;
                        lastMessage.tool_calls.push(toolCalls[0])
                        
                    }
                } 
                

                //因为是流式输出所以要遍历取出函数参数
                toolCalls.forEach((item) => {
                    if (item.function.arguments) {
                        requirePar += item.function.arguments
                    }
                    lastMessage.tool_calls[0].function.arguments = requirePar
                });
            }

            //把工具调用结果返回前端
            if (obj.choices[0].finish_reason == 'tool_calls') {
                const resObj = JSON.stringify({ type: "function", functionName, data: JSON.parse(requirePar),modelType:"qwen" })
                const buffer = Buffer.from(resObj) //流式输出
                ctx.res.write(buffer)
            }
            
            //没有工具调用
            if (choices.content) {
                const resObj = JSON.stringify({ type: "content", functionName:"", data: choices.content,modelType:"qwen" })
                const buffer = Buffer.from(resObj) //流式输出
                ctx.res.write(buffer)
            }
        }
    }

    
}

module.exports = new ChatController();