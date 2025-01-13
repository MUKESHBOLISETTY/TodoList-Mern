const router = require('express').Router();
const UserRegister = require("../schemas/UserRegister");
const ListSchema = require("../schemas/List");
const TokenSchema = require("../schemas/Token");
router.post("/deleteUser", async (req, res) => {
    try {
        const Tokenrecived = req.body.token;
        const Password = req.body.pass;
        const data = await UserRegister.findOne({ token: Tokenrecived });
        if (data?.token !== Tokenrecived) {
            res.json({ success: true, message: 'invaliduser' });
        } else if (data.token == Tokenrecived) {
            if(data.password == Password){
                await ListSchema.findOneAndDelete({ userId: data._id });
                await TokenSchema.findOneAndDelete({ userId: data._id });
                await UserRegister.deleteOne({ token: Tokenrecived })
                res.json({ success: true, message: 'accountdeleted' });
            } else {
                res.json({ success: true, message: 'passwordincorrect' });
            }
            
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
