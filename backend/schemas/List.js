const Mongoose = require("mongoose");

const ListSchema = new Mongoose.Schema({
    userId:
    {
        type: Mongoose.Types.ObjectId,
        ref: "UserRegister",
        required: true,
    },
    tasks: [{
        taskId: { type: String, required: true, unique: true},
        title: { type: String, required: true },
        description: { type: String, required: true },
        notify: { type: Boolean, require: true, default: false }
    }]
})

module.exports = Mongoose.model("List", ListSchema);
