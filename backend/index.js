const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');   
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const dotenv = require('dotenv').config();

const port = process.env.PORT || 5000;

const authRouter = require("./route/auth")
const userRoutes = require("./route/user_routes")
const leaveRoutes = require("./route/leave_routes")
const attendanceRoutes = require("./route/attendance_routes")


app.use('/api/auth',authRouter)
app.use('/api/users', userRoutes)
app.use('/api/leave', leaveRoutes)
app.use('/api/attendance', attendanceRoutes)



app.get('/', (req, res) => {    
    res.send("Hello Testing");
});

app.listen(port, () => {
    console.log(`SERVER ${port} is running.....`)
})

module.exports = app;