const Mongoose = require("mongoose")

const TokenSchema = new Mongoose.Schema({
    token: { type: String, required: true, default: null },
    userId: [
        {
            type: Mongoose.Types.ObjectId,
            ref: "UserRegister",
            required: true,
            unique: true
        }
    ],
    createdAt: { type: Date, default: Date.now(), expires: 3600 }
})

module.exports = Mongoose.model("TokenSchema", TokenSchema)