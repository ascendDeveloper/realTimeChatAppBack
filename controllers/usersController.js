const User = require('../models/usersModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try{
        const { username, email, password } = req.body
        const usernameCheck = await User.findOne({username})
        if(usernameCheck){
            return res.json({msg:'Username already used', status: false})
        }
        const emailCheck = await User.findOne({email})
        if(emailCheck){
            return res.json({msg:'Email already used', status: false})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        })
        delete user.password
        return res.json({status: true, user})
    } catch(err) {
        next(err)
    }
    
}

module.exports.login = async (req, res, next) => {
    try{
        const { username, password } = req.body
        const user = await User.findOne({username})
        if(!user){
            return res.json({msg:'Incorrect username or passsword', status: false})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.json({msg:'Incorrect username or passsword', status: false})
        }
        delete user.password
        return res.json({status: true, user})
    } catch(err) {
        next(err)
    }
    
}