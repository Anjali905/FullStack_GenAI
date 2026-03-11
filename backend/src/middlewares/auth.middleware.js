const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../model/blacklist.model");
async function authUser(request, response, next) {
    const token = request.cookies.token;
    if(!token){
        return response.status(401).json({
            message:"Token not provided "
        })
    }
    const isTokenBlacklisted= await tokenBlacklistModel.findOne({token});
    if(isTokenBlacklisted){
        return response.status(401).json({
            message:"Token is Invalid!"
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded;
        next();
    }catch(err){
        return response.status(401).json({
            message:"Invalid token"
        })
    }
    
}
module.exports = {authUser};