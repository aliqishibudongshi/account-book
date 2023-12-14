//导入 jsonwebtoken
const jwt = require("jsonwebtoken"); 
//导入配置文件中的secret
const {secret} = require("../config/config"); 
module.exports = (req, res, next) => {
    //获取token
    let token = req.get("token");
    //没有token
    if (!token) {
        return res.json({
            code: '2003',
            msg: 'token缺失',
            data: null
        })
    }
    //有token，验证token
    jwt.verify(token, secret, (err, data) => {
        //token验证错误
        if (err) {
            return res.json({
                code: '2004',
                msg: 'token失效',
                data: null
            })
        }
        //token验证成功
        //在req中创建一个属性user，用来保存用户信息！！
        req.user = data;
        next();
    })
}