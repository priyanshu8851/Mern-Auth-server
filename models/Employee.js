const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // Ensure jwt is required if you haven't done it already
const bcrypt= require('bcrypt');
const EmployeeSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

EmployeeSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) {
        next();
    }

    try {
        const saltRound = await bcrypt.genSalt(5);
        const hash_password = await bcrypt.hash(user.password, saltRound);

        user.password = hash_password;

    } catch (err) {
        next(err)
    }
})


EmployeeSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email
            },
            process.env.JWT_KEY,
            {
                expiresIn: "30d"
            }
        );
    } catch (err) {
        console.log(err);
    }
};
EmployeeSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password, this.password);
}

const EmployeeModel = mongoose.model("Employees", EmployeeSchema);
module.exports = EmployeeModel;
