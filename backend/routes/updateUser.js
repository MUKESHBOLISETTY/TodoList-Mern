const router = require('express').Router();
const UserRegister = require("../schemas/UserRegister");

router.post("/updateUser", async (req, res) => {
    try {
        const Tokenrecived = req.body.payload.token;
        const data = await UserRegister.findOne({ token: Tokenrecived });
        if (data?.token !== Tokenrecived) {
            res.json({ success: true, message: 'invaliduser' });
        } else if (data.token == Tokenrecived) {
            if (req.body.payload.avatarId) {
                try {
                    data.avatarId = req.body.payload.avatarId;
                    await data.save();
                    res.json({ success: true, flag: 'success', message: 'logo updated' });
                } catch (error) {
                    res.json({ success: true, message: 'failed' });
                }
            }
            if (req.body.payload.username) {
                try {
                    data.username = req.body.payload.username;
                    await data.save();
                    res.json({ success: true, flag: 'success', message: 'username updated' });
                } catch (error) {
                    res.json({ success: true, message: 'failed' });
                }

            }

        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;