const Mongoose = require("mongoose");

const UserRegisterSchema = new Mongoose.Schema({
    token: { type: String, required: true},
    username: { type: String, required: true},
    mail: { type: String, required: true},
    password: { type: String, required: true},
    avatarId: { type: String, required: true},
    forgottoken: { type: String, default: null},
    verified: { type: Boolean, default: false}
})

module.exports = Mongoose.model("UserRegister", UserRegisterSchema);
