/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVar } from "./app/config/env.config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVar.MONGODB_URI)

        console.log("Data Base is connected");

        server = app.listen(envVar.PORT, () => {
            console.log(`Server is running Port on ${envVar.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}
startServer()

process.on("SIGTERM", () => {
    console.log("Sigterm received ....sever shuting d");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
})

process.on("SIGINT", () => {
    console.log("SIGINT signal  received ....sever shuting down");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
})


process.on("unHandleRejection", (err) => {
    console.log("unHandle Rejection detected", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
})
process.on("uncaughtException", (err) => {
    console.log("Un caught exception detected", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
})

