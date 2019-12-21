const bcrypt = require('bcryptjs')
const {sequelize} = require('../db');
const {Sequelize, Model} = require('sequelize')

// 定义管理员模型
class Admin extends Model {}

// 初始用户模型
Admin.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // 管理员昵称
    nickname: Sequelize.STRING,
    // 管理员邮箱
    email: {
        type: Sequelize.STRING(128),
        unique: true
    },
    // 管理员密码
    password: {
        type: Sequelize.STRING,
        set(val) {
            // 加密
            const salt = bcrypt.genSaltSync(10);
            // 生成加密密码
            const psw = bcrypt.hashSync(val, salt);
            this.setDataValue("password", psw);
        }
    },
}, {
    sequelize,
    tableName: 'admin'
})


module.exports = {
    Admin
}
