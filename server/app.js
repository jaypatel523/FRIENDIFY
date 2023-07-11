require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connectDB');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');


const app = express();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: '*',
    credentials: true
}));


// production 
// const fullPath = path.join(__dirname, '../client/dist');
// app.use(express.static(fullPath));

// app.get("/", function (req, res) {
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'))
// })

//app.use(express.static(path.join(__dirname, '../client2/dist')));
// routes 
app.use('/uploads', express.static('uploads'));
app.use('/', userRouter);
app.use('/', authRouter);
app.use('/', postRouter);




// // Catch unauthorised errors
// app.use((err, req, res, next) => {
//     if (err.name === 'UnauthorizedError') {
//         res.status(401).json({ "error": err.name + ": " + err.message })
//     } else if (err) {
//         res.status(400).json({ "error": err.name + ": " + err.message })
//         console.log(err)
//     }
// })





// start the server 
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(process.env.PORT, () => console.log(`server is listening on port : ${process.env.PORT}`))
    }
    catch (err) {
        console.log(err);
    }
}

start();