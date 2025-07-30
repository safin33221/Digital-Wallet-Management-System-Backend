/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect('mongodb+srv://Digital-Wallet-Management:Hs8JEINyCIQv2miL@cluster0.blz8y.mongodb.net/Library-Management?retryWrites=true&w=majority&appName=Cluster0')

        console.log("Data Base is connected");

        server = app.listen(5000, () => {
            console.log(`Server is running Port on 5000`);
        })
    } catch (error) {
        console.log(error);
    }
}

startServer()