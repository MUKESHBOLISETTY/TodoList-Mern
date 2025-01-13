const router = require('express').Router();
const UserRegister = require("../schemas/UserRegister");
const uniqid = require('uniqid');
const TokenSchema = require("../schemas/Token");
const sendMail = require("../sendMail.js");
const crypto = require("crypto")
router.post("/signup", async (req, res) => {
    try {
        const formData = req.body.data;
        console.log(formData)
        const data = await UserRegister.findOne({ mail: formData.mail })
        if (data?.mail !== formData.mail) {
            let userData = new UserRegister({
                token: uniqid(),
                username: formData.username,
                mail: formData.mail,
                password: formData.password,
                avatarId: formData.avatarId
            })
            const user = await userData.save();
            const Token = await new TokenSchema({
                token: crypto.randomBytes(32).toString("hex"),
                userId: user._id,
            }).save();
            const url = `${process.env.FRONTEND_URL}/auth/${user._id}/verify/${Token.token}`
            await sendMail(user.mail, "Verify Email to continue ToDo Application", url)
            res.json({ success: true, message: 'saved', email: 'sent' })
            res.end();
        } else if (data.mail === formData.mail) {
            res.json({ success: true, message: 'mailexists' })
        }

    } catch (error) {
        res.json({ success: false, message: 'lol' })
    }
})

router.post("/login", async (req, res) => {
    try {
        const formData = req.body.data;
        const data = await UserRegister.findOne({ mail: formData.mail })
        if (data?.mail !== formData.mail) {
            res.json({ success: true, message: 'usernotfound' })
            res.end();
        } else if (data.mail === formData.mail) {
            if (data.password === formData.password) {
                if (!data.verified) {
                    const token = await TokenSchema.findOne({ userId: data._id });
                    if (token) {
                        await TokenSchema.deleteMany({ userId: data._id });
                    }
                    const Token = await new TokenSchema({
                        token: crypto.randomBytes(32).toString("hex"),
                        userId: data._id,
                    }).save();
                    const url = `${process.env.FRONTEND_URL}/auth/${data._id}/verify/${Token.token}`
                    await sendMail(data.mail, "Verify Email to continue ToDo Application", url)
                    res.json({ success: true, message: 'verification' })
                } else {
                    const details = {
                        "username": data.username,
                        "mail": data.mail,
                        "token": data.token,
                        "user": data._id
                    }
                    res.json({ success: true, message: 'approved', details })
                }
            } else {
                res.json({ success: true, message: 'denied' })
            }
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'lol' })
    }
})

router.get("/:id/verify/:token", async (req, res) => {
    try {
        const User = req.params.id;
        const Token = req.params.token;
        const data = await UserRegister.findOne({ _id: User });
        if (!data) return res.json({ success: true, message: "Invalid Link" })

        const token = TokenSchema.findOne({ userId: User, token: Token })
        if (!token) return res.json({ success: true, message: "Invalid Link" })

        await data.updateOne({ verified: true });
        await token.deleteOne({ userId: User });
        res.json({ success: true, message: 'verified' });
    } catch (error) {
        console.log(error)
    }
})

router.post("/resetpassword", async (req, res) => {
    try {
        const Mail = req.body.mail;
        const data = await UserRegister.findOne({ mail: Mail });
        if (!data) {
            res.json({ success: true, message: 'invaliduser' });
        } else {
            data.forgottoken = crypto.randomBytes(32).toString("hex");
            await data.save();
            const url = `${process.env.FRONTEND_URL}/password/${data._id}/reset/${data.forgottoken}`
            await sendMail(data.mail, "ToDo App password reset link", url)
            res.json({ success: true, message: "mailsent" })
        }
    } catch (error) {
        res.json({ success: false, message: 'Something went wrong' })
    }
})

router.get("/reset/:id/:token", async (req, res) => {
    try {
        const User = req.params.id;
        const Token = req.params.token;
        const data = await UserRegister.findOne({ _id: User, forgottoken: Token });
        if (!data) return res.json({ success: true, message: "invalidlink" })

        res.json({ success: true, message: 'validlink' });
    } catch (error) {
        console.log(error)
    }
})

router.post("/reset/:id/:token", async (req, res) => {
    try {
        const User = req.params.id;
        const Token = req.params.token;
        const data = await UserRegister.findOne({ _id: User, forgottoken: Token });
        if (!data) return res.json({ success: true, message: "Invalid Link" })
        data.password = req.body.newPassword;
        data.forgottoken = null;
        await data.save();
        res.json({ success: true, message: 'changed' });
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;