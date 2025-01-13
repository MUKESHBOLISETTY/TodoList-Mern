const router = require('express').Router();
const List = require('../schemas/List');
const ListSchema = require('../schemas/List');
const UserRegister = require('../schemas/UserRegister');
const crypto = require("crypto")
router.post('/createTask', async (req, res) => {
    try {
        const Body = req.body;
        const title = Body.title;
        const description = Body.description;
        const notify = Body.notify;
        const taskId = crypto.randomBytes(8).toString('hex');
        const data = await UserRegister.findOne({ _id: Body.userid });
        const Lists = await ListSchema.findOne({ userId: Body.userid })
        if (!data) {
            res.json({ success: true, message: 'invaliduser' });
        } else {
            if (!Lists) {
                const newTask = new ListSchema({
                    tasks: [{
                        taskId, title, description, notify
                    }],
                    userId: Body.userid
                })
                await newTask.save()
                res.json({ success: true, message: 'created' });
            } else {
                Lists.tasks.push({ taskId, title, description, notify });
                await Lists.save();
                res.json({ success: true, message: 'created' });
            }
        }
    } catch (error) {
        console.log(error)
    }
});

router.post('/getTasks', async (req, res) => {
    try {
        const Body = req.body.userid;
        const data = await ListSchema.findOne({ userId: Body });
        if (!data) {
            res.json({ success: true, message: 'notaksfound' })
        } else {
            const tasks = data.tasks;
            res.json({ success: true, message: 'found', tasks })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/deleteTask', async (req, res) => {
    try {
        const UserId = req.body.userId;
        const TaskId = req.body.taskId;

        const Tasks = await ListSchema.findOne({ userId: UserId, "tasks.taskId": TaskId });
        if (!Tasks) {
            res.json({ success: true, message: 'notaksfound' })
        } else {
            await ListSchema.findOneAndUpdate({ userId: UserId }, { $pull: { tasks: { taskId: TaskId } } }, { new: true })
            res.json({ success: true, message: 'taskdeleted' })
        }
    } catch (error) {
        console.log(error)
    }
})

router.put('/editTask', async (req, res) => {
    try {
        const UserId = req.body.userId;
        const TaskId = req.body.taskId;
        const Title = req.body.newTitle;
        const Description = req.body.newDescription;
        const Notify = req.body.notify;
        const data = await ListSchema.findOne({ userId: UserId, "tasks.taskId": TaskId });
        if (!data) {
            res.json({ success: true, message: 'notaksfound' })
        } else {
            const updateFields = {};
            if (Title) updateFields["tasks.$.title"] = Title;
            if (Description) updateFields["tasks.$.description"] = Description;
            if (Notify) updateFields["tasks.$.notify"] = Notify;

            if (Object.keys(updateFields).length > 0) {
                await ListSchema.findOneAndUpdate(
                    { userId: UserId, "tasks.taskId": TaskId },
                    { $set: updateFields },
                    { new: true }
                );
                res.json({ success: true, message: 'changed' })
            } else {
                res.json({ success: true, message: 'notchanged' })
            }
        
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;