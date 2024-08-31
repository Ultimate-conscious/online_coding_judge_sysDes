import {WebSocket} from "ws";
import express from "express";
import redis,{createClient} from "redis";


const app = express();

const httpServer = app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

const wss = new WebSocket.Server({ server: httpServer });

const client = createClient();

wss.on("connection", async(ws) => {

    await client.connect();

    ws.on('error', (err) => {
        console.log("An error occured on the server");
    });

    ws.on("message",async (data,isBinary) => {

        console.log(JSON.parse(data.toString())); 

        await client.lPush("submissions",JSON.stringify(JSON.parse(data.toString())));

        ws.send("Submission queued successfully");
        
    });

    ws.send("Welcome to the server!!!");
});