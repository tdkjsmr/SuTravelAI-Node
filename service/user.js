const { v4: uuidv4 } = require('uuid');
class UserService{
    async getOpenid() {
        const uniqueId = uuidv4(); 
        return uniqueId
    }
        
}
module.exports = UserService
