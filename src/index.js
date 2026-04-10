import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config();

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port : ${process.env.PORT}`);
    })
})
.catch((error) =>{
    console.log("MONGO db connection failed !!! ",error);
})






/*
import express from "express";
const app = express();
;(async () => {
    try {
        await mongoose(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error", () => {
            console.log("ERROR:",error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`app is listening on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.log("ERROR:",error);
        throw err
        
    }
})()
    */