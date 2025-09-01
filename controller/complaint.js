const { modelComplaint } = require("@/model/complaint")
const Validate = require("@/validate")

class complaintController{
    //新增诉求
    async addComplaint(ctx) {
        const { complaintTarget, complaintReason, location, appeal, userName, phoneNumber, travelMethod } = ctx.request.body
        await Validate.nullCheck(complaintTarget, "请选择投诉对象", "complaintTarget")
        await Validate.nullCheck(complaintReason, "请填写投诉原因", "complaintReason");
        await Validate.nullCheck(location, "请选择投诉地区", "location");
        await Validate.nullCheck(appeal, "请填写诉求", "appeal");
        await Validate.nullCheck(userName, "请填写姓名", "userName");
        await Validate.nullCheck(phoneNumber, "请填写联系方式", "phoneNumber");
        await Validate.nullCheck(travelMethod, "请选择旅行方式", "travelMethod");
        await modelComplaint.create({
            complaintTarget,
            complaintReason,
            location,
            appeal,
            userName,
            phoneNumber,
            travelMethod,
        });
        ctx.send()
    } 
    
}

module.exports = new complaintController()