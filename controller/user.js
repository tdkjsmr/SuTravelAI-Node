const User = require("@/model/user")
const Validate = require("@/validate/index")
const generateToken = require("@/config/jwt");
class UserController{
    async login(ctx) {
        const { nickName, avatar} = ctx.request.body;
        await Validate.nullCheck(nickName, "请输入昵称", "nickName");
        await Validate.nullCheck(avatar, "请上传头像", "avatar");
        const userInfo = await User.findOne({ where: { nickName } });
        if (!userInfo) {
            await User.create({ nickName, avatar});
        }
        ctx.send({ token: generateToken(nickName), nickName, avatar });
        
    }
}
module.exports = new UserController();