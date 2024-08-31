import {WebSocket} from "ws";
import express from "express";
import redis,{createClient} from "redis";


const app = express();

const httpServer = app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

const wss = new WebSocket.Server({ server: httpServer });

async function getRedisClient(){
    const client = await createClient()
    return client;
}

wss.on("connection", async(ws) => {
    ws.on('error', (err) => {
        console.log("An error occured on the server");
    });
    
    const client = await getRedisClient();
    client.connect();

    ws.on("message",async (data,isBinary) => {

        console.log(JSON.parse(data.toString())); 

        await client.lPush("submissions",JSON.stringify(JSON.parse(data.toString())));

        ws.send("Submission queued successfully");
        
    });

    ws.send("Welcome to the server!!!");
});