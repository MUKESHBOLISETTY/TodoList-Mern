const router = require('express').Router();
const UserRegister = require("../schemas/UserRegister");

router.post("/updatePassword", async (req, res) => {
    try {
        const Tokenrecived = req.body.token;
        const OldPassword = req.body.Oldpass;
        const NewPassword = req.body.Newpass;
        const data = await UserRegister.findOne({ token: Tokenrecived });
        if (data?.token !== Tokenrecived) {
            res.json({ success: true, message: 'invaliduser' });
        } else if (data.token == Tokenrecived) {
            if (data.password == OldPassword) {
                data.password = NewPassword;
                await data.save();
                res.json({ success: true, message: 'passwordchanged' });
            } else {
                res.json({ success: true, message: 'passwordincorrect' });
            }

        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;