"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
const httpServer = app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
const wss = new ws_1.WebSocket.Server({ server: httpServer });
const client = (0, redis_1.createClient)();
wss.on("connection", (ws) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
    ws.on('error', (err) => {
        console.log("An error occured on the server");
    });
    ws.on("message", (data, isBinary) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(JSON.parse(data.toString()));
        yield client.lPush("submissions", JSON.stringify(JSON.parse(data.toString())));
        ws.send("Submission queued successfully");
    }));
    ws.send("Welcome to the server!!!");
}));
