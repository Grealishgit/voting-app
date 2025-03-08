const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");

const Routes = require("./routes/Routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Allow CORS from any origin with credentials
app.use(cors({
    origin: (origin, callback) => {
        callback(null, true); // Allow any origin
    },
    credentials: true // Allow credentials
}));

app.use(upload());

app.use("/", Routes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT, () =>
            console.log(`Server started on port ${process.env.PORT}`)
        );
    })
    .catch(err => console.log("Database connection error:", err));