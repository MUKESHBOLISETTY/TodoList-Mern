const router = require('express').Router();
const UserRegister = require("../schemas/UserRegister");

router.post("/logincheck", async (req, res) => {
    try {
        const Tokenrecived = req.body;

        const data = await UserRegister.findOne({ token: Tokenrecived.token });

        if (data?.token !== Tokenrecived.token) {
            res.json({ success: true, message: 'invaliduser' });
        } else if (data.token == Tokenrecived.token) {
            const details = {
                "username": data.username,
                "mail": data.mail,
                "avatarId": data.avatarId,
                "token": data.token,
                "user": data._id
            }
            res.json({ success: true, message: 'userauthenticated', details });
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;