const { ZhipuAI } = require("zhipuai-sdk-nodejs-v4");
const { apiKey } = require("@/config/default").zhipu;
const Validate = require("@/validate/index");
const ai = new ZhipuAI({ apiKey });
class ZhipuaiController { 
    //文生图
    async createImages(ctx) {
        const { prompt } = ctx.request.body;
        await Validate.nullCheck(prompt, "请输入图像的文本描述", "prompt");
        const imageData = await ai.createImages({
          model: "cogview-4",
          prompt,
        });
        ctx.send({
          url: imageData.data[0].url,
          prompt: "我已为你生成对应的图片,你可以继续问我!",
        });
    }
    
}
module.exports = new ZhipuaiController();