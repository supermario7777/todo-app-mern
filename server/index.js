const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require('cors')


const app = express();

app.use(express.json());


const PORT = process.env.PORT || 5050;

app.use(cors({
    origin: ["https://todo-app-mern-wkw2.vercel.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const TodoItemRoute = require("./routes/todoItems");

mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        console.log("Database connected")
    })
    .catch(err => {
        console.log(err)
    })

app.use("/", TodoItemRoute);

app.get("/", (req, res) => {
    res.send("Hello from your Vercel app!");
});


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} PORT`)
})