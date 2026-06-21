const bcrypt = require("bcryptjs")

const hashedPassword = async(password) => {
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password,salt)
    return hashPassword
}

const comparePassword = async(password,hashPassword) => {
    const isMatch = await bcrypt.compare(password,hashPassword)
    return isMatch;
}

module.exports = {
    hashedPassword,
    comparePassword
}