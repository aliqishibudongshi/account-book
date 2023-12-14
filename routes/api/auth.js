const express = require('express');
//导入 用户的模型
const UserModel = require('../../models/UserModel');
const md5 = require('md5');
//导入 jsonwebtoken
const jwt = require("jsonwebtoken");
//导入配置文件中的secret
const {secret} = require("../../config/config");


//创建路由
const router = express.Router();


//登录操作
router.post('/login', (req, res) => {
  //获取用户名和密码
  let {username, password} = req.body;
  //查询数据库
  UserModel.findOne({username: username, password: md5(password)}, (err, data) => {
    //判断
    if(err){
      res.json({
        code: "2001",
        msg: "数据库获取失败",
        data: null
      })
      return;
    }
    //判断 data
    if(!data){
      return res.json({
        code: "2002",
        msg: "账号或密码错误",
        data: null
      })
      
    }
    //创建token
    let token = jwt.sign({
      _id: data._id,
      username: data.username
    },
    secret,
    {
      expiresIn: 60 * 60 * 24 * 7 //设置token有效期7天
    });

    //登录成功响应
    res.json({
      code: "0000",
      msg: "登录成功",
      data: token
    });
  })

});

//退出登录
router.post('/logout', (req, res) => {
  //销毁 session
  req.session.destroy(() => {
    res.render('success', {msg: '退出成功', url: '/login'});
  })
});

module.exports = router;
