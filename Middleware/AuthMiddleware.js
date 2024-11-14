const jwt = require('jsonwebtoken')
const EmployeeModel = require("../models/Employee")


const authmiddleware = async (req, res, next) => {


    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized HTTP Request, Token not Provided"
        })
    }

    const jwtToken = token.replace("Bearer", "").trim();


    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_KEY)
        const userData = await EmployeeModel.findOne({ email: isVerified.email }).select({
            password: 0
        })
        req.user = userData
        req.token = jwtToken
        req.userID = userData._id
        next();
    } catch (error) {
        return res.status(400).json({
            error: "Something went wrong",
            error
        })
    }
}
module.exports =  authmiddleware 