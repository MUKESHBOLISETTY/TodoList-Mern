const express = require('express')
const app = express()
const port = 3000
const signup = require('./routes/register.js')
const updatePassword = require('./routes/PassManager.js')
const logincheck = require('./routes/logincheck.js')
const updateUser = require('./routes/updateUser.js')
const deleteUser = require('./routes/deleteUser.js');
const cors = require("cors");
const createTask = require('./routes/taskManager.js');
const { config } = require("dotenv");

config();
const corsoptions = {
  origin: `${process.env.FRONTEND_URL}`,
  methods: "GET, POST, PUT, DELETE, HEAD, PATCH",
  credentials: true,
}
console.log(corsoptions.origin)
app.use(cors(corsoptions));

require('./mongo.js')();

app.use(express.json());

app.use('/api/v1', signup, deleteUser, updatePassword, updateUser, createTask);
app.use('/api', logincheck);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
